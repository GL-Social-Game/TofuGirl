import * as global from "GlobalData";
import * as constant from "Constant";
import * as ecrypt from "Encrypt";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        tempLabel:{
            default: null,
            type: cc.Label,
        },
    },

    // use this for initialization
    //mg2020
    onLoad: function () {
        // if(URL.lang != null){
        //     if(URL.lang == "en" || URL.lang == "ch" || URL.lang == "tw" ){
        //         global.setLang(URL.lang);
        //     }else{
        //         global.setLang("en");
        //         URL.lang = "en";
        //     }
        // }else{
        //     global.setLang("en");
        //     URL.lang = "en";
        // }
        if(this.tempLabel!=null){
            this.tempLabel.string = "Max: "+global.MaxWinMultiplier;
        }
    },

    //#region  ENCRYPTION
    decode(data) {
        // convert from base64 and return object in string
        return atob(data);
    },

    encode(data) {
        // convert string object to base64 string and return the string
        return btoa(data);
    },

    socketReceiveAction(data) {
        if (global.isEncrypt) {
            return JSON.parse(this.decode(data));
        }
        else {
            return data;
        }
    },
    //#endregion

    isParsable : function (input) {
        try {
            JSON.parse(input);
        } catch (e) {
            return false;
        }
        return true;
    },

    parseDataFormat: function(data){
        if (this.isParsable(data) == true){
            return JSON.parse(data);
        }else{
            return data;
        }
    },

    connectSocket: function(data){
        var self = this;
        this.firstConnect = true;
        var device_type = "Desktop";
        if(cc.sys.isMobile){
            device_type = "Mobile";
        }

        if (cc.sys.isNative) {
            window.io = SocketIO;
            // window.io = SocketIO || io;
            // not using bet in ketupat
            if(data == "bet"){
                var tempSocket = io.connect(constant.getSocketURL());
                global.setSocket(tempSocket);
            }
            else{
                var tempSocket = io.connect(constant.getSocketURL());
                global.setSocket(tempSocket);
            }
        }else {
        // window.io = require('socket.io-client');
            // not using bet in ketupat
            if(data == "bet"){
                var tempSocket = io(constant.getSocketURL());
                global.setSocket(tempSocket);
            }
            else{
                var tempSocket = io(constant.getSocketURL());
                global.setSocket(tempSocket);
            }
        }

        // if(!cc.sys.isNative){
        global.getSocket().on('connect', function() {
            var emit_obj = {
                
            };

            // emit_obj = ecrypt.encrypt(JSON.stringify(emit_obj));
            global.getSocket().emit("subscribe",emit_obj);

        });
        self.listenEvent();
        // }
        // this.getComponent("MainMenu").load_layer.active = false;

        // this.getComponent("MainMenu").initializeVariable();
    },

    listenEvent: function(){
        var self = this;
        global.getSocket().on('balance', function(data){
            data = self.socketReceiveAction(data);

            global.settings.balance = data.after_balance;
            global.finishGeneratingBalance = true;
        });

        global.getSocket().on('reconnecting', function(){
            console.log("reconnecting");
        });

        global.getSocket().on('reconnect', function(){
            console.log("success reconnect");
        });

        global.getSocket().on('getResult', function(data){
            data = self.socketReceiveAction(data);
            global.ticket_id = data.ticket_id;
            global.settings.balance = data.balance;
            global.maxPayOut = data.maxResult;
            if(global.game_code == 71){
                global.MaxWinMultiplier = data.maxMultiplier;
                cc.log("Max Win Multiplier: "+global.MaxWinMultiplier);
                // self.tempLabel.string = "Max: "+global.MaxWinMultiplier;
            }
            global.finishGetData = true;

        });

        /// if socket receive more than expected result
        global.getSocket().on("cheat", function (data) {
            data = self.socketReceiveAction(data);

            global.errorMessage = data.error;
            global.playerBalance = data.after_balance;
        }),

        global.getSocket().on('kick-user-maintenance', function(data){
            // data = self.parseDataFormat(data);
            // var resp = data;
            data = self.parseDataFormat(data);
            var resp = ecrypt.decrypt(data);
            resp = self.parseDataFormat(resp);

            // self.getComponent("uiController").showErrorMessage(commonErrorMessage[URL.lang][resp.status_code], true);
        });

        global.getSocket().on('kick-user', function(data){
            // var resp = data;
            data = self.parseDataFormat(data);
            var resp = ecrypt.decrypt(data);
            resp = self.parseDataFormat(resp);

            if(commonErrorMessage[URL.lang][resp.status_code] != null){
                // self.getComponent("uiController").showErrorMessage(commonErrorMessage[URL.lang][resp.status_code], true);
            }

            if(resp.status_code == "1028"){
                global.getSocket().disconnect()
            }
        });
    },

    removeEventListener: function(){
        global.getSocket().removeEventListener("balance");
        global.getSocket().removeEventListener("reconnecting");
        global.getSocket().removeEventListener("reconnect");
        global.getSocket().removeEventListener("onSubscribeDone");
        global.getSocket().removeEventListener("onResult");
        global.getSocket().removeEventListener("kick-user-maintenance");
        global.getSocket().removeEventListener("kick-user");
    },

    
});
