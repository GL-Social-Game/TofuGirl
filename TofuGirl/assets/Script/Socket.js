import * as global from "GlobalData";
import * as constant from "Constant";
import * as ecrypt from "ecrypt";
var MobileDetect = require('mobile-detect');

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
        this.mobileDetect = new MobileDetect(window.navigator.userAgent);

        if(this.tempLabel!=null){
            this.tempLabel.string = "Max: "+global.MaxWinMultiplier;
        }
    },

    //#region  ENCRYPTION
    decode(data) {
        // convert from base64 and return object in string
        return ecrypt.decrypt(data);
    },

    encode(data) {
        // convert string object to base64 string and return the string
        return ecrypt.encrypt(data);
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
        self.listenEvent();
    },

    listenEvent: function(){
        var self = this;
        global.getSocket().on('connect', function() {
            cc.log("Socket Connected");
            if(global.isDemo) return;
            var body = {
                "username": global.settings.username,
                "access_token": global.access_token,
                "game_code": global.game_code,
                "api_url": global.api_Url,
                "host_id": global.host_id,
                "user_id": global.settings.user_id,
                "device_type": self.getDeviceType(),
                "browser_type": self.getBrowserType(),
                "os_version": self.getOSversion(),
                "os_type": self.getOSType(),
                "h5_app": global.h5_app,
                "phone_model": self.getPhoneModel(),
                "user_agent": self.getUserAgent(),
            };
            if (global.isEncrypt) {
                global.getSocket().emit('subscribe', self.encode(JSON.stringify(body)));
            } else {
                global.getSocket().emit('subscribe', body);
            }
        });

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
            // if(global.game_code == 71){
                global.MaxWinMultiplier = data.maxMultiplier;
                cc.log("Max Win Multiplier: "+global.MaxWinMultiplier);
                // self.tempLabel.string = "Max: "+global.MaxWinMultiplier;
            // }
            global.finishGetData = true;

        });

        /// if socket receive more than expected result
        global.getSocket().on("cheat", function (data) {
            data = self.socketReceiveAction(data);

            global.errorMessage = data.error;
            global.playerBalance = data.after_balance;
        }),

        global.getSocket().on('kick-user-maintenance', function(data){
            
        });

        global.getSocket().on('kickUser', function(data){
            data = self.socketReceiveAction(data);

            global.isKicked = true;
            global.kickMessage = "You have exceeded daily profit limit.";
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
        
    //#region Get Device Info Functions
    getDeviceType()
    {
        if(cc.sys.isMobile)
        {
            return 1;
        }else if (this.mobileDetect.tablet()!=null)
        {
            return 2;
        }else
        {
            return 0;
        }
    },
    getBrowserType()
    {
        return cc.sys.browserType + " : " + cc.sys.browserVersion;
    },
    getOSversion()
    {
        return cc.sys.osVersion;
    },
    getOSType()
    {
        switch(cc.sys.os)
        {
            case "OS X":
                return 3;
            case "Android":
                return 0;
            case "Windows":
                return 2;
            case "Linux":
                return 4;
            case "iOS":
                return 1;
            default:
                return 99;
        }
        
    },
    getPhoneModel()
    {
        if(this.mobileDetect.phone()==null)
        {
            return "Desktop";
        }else
        {
            return this.mobileDetect.phone();
        }
        
    },
    getUserAgent()
    {
        return window.navigator.userAgent;
    },
    //#endregion 
});
