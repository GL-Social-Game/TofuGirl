// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import * as globalData from "GlobalData";
cc.Class({
    extends: cc.Component,
    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        inGameBetting:{
            default:null,
            type:cc.Node,
        },
        loadingLayer:{
            default:null,
            type:cc.Node,
        },

        balance:{
            default:null,
            type:cc.Label,
        },

        insufficientCredit:{
            default : null,
            type:cc.Node,
        },
        settingLayer:{
            default : null,
            type:cc.Node,
        },
        musicToggle:{
            default : null,
            type:cc.Toggle,
        },
        button_click:{
            default:null,
            type:cc.AudioClip,
        },
        forDemo:false,

        sureExit:{
            default:null,
            type:cc.Node,
        },
    },

    openExit(){
        this.sureExit.active=true;
    },
    closeExit(){
        this.sureExit.active=false;
    },
    openInsufficient(){
        this.insufficientCredit.active = true;
    },

    closeInsufficient(){
        this.insufficientCredit.active = false;
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(cc.sys.isMobile){
			cc.view.resizeWithBrowserSize(true);
			cc.view.setDesignResolutionSize(1080, 1920, cc.ResolutionPolicy.EXACT_FIT);
		}else{
			this.node.getComponent(cc.Canvas).fitHeight = true;
			this.node.getComponent(cc.Canvas).fitWidth = true;
        }
        
        if (globalData.getSound() == 0) {
            this.musicToggle.isChecked = false; 
        }

        this.loadingLayer.active =true;
        // this.api = this.node.getComponent("API");
        // this.api.getSettings();
        if(!globalData.getSocket()){
            this.getComponent("Socket").connectSocket();
        }
        const isIOS14Device = cc.sys.os === cc.sys.OS_IOS && cc.sys.isBrowser && cc.sys.isMobile && /iPhone OS 14/.test(window.navigator.userAgent);
        if (isIOS14Device) {
            cc.MeshBuffer.prototype.checkAndSwitchBuffer = function (vertexCount) {
                if (this.vertexOffset + vertexCount > 65535) {
                    this.uploadData();
                    this._batcher._flush();
                }
            };     
            cc.MeshBuffer.prototype.forwardIndiceStartToOffset = function () {
                this.uploadData();
                this.switchBuffer();
            }  
        }
    },

    start () {

    },

    openSettings(){
        this.settingLayer.active=true;
    },

    closeSettings(){
        this.settingLayer.active=false;

    },

    fullScreen(){
        if(cc.screen.fullScreen()){
            cc.screen.exitFullScreen();
        }
        else{
            cc.screen.requestFullScreen();
        }

    },

    buttonClickSound(){
        this.playEffect(this.button_click, globalData.getEffectVolume());
    },

    
    playEffect:function(audio, volume){
        this.effect_id2 = cc.audioEngine.play(audio, false);
        if(globalData.getSound() == 0 ){
            cc.audioEngine.setVolume(this.effect_id2, 0.0);
        }else if(volume != null){
            cc.audioEngine.setVolume(this.effect_id2, volume);
        }
        return this.effect_id2;
    },


    blankScreen(){
        if (globalData.settings.lobby_url != null && globalData.settings.lobby_url != "") {
            window.open(globalData.settings.lobby_url, "_self");
        } else {
            window.open("about:blank", "_self");
        }
    },


    updateCreditLabel(){
        this.loadingLayer.active =false;
        this.balance.string = Math.round(globalData.settings.balance * 100) / 100;
    },
    startGame(){
        if (this.inGameBetting.getComponent("InGameBetting").checkSufficientMoney()) {
            this.inGameBetting.getComponent("InGameBetting").pay();
            this.forDemo=true;
            this.loadingLayer.active = true;
        }
        else {
            this.openInsufficient();
        }   
    },
    update (dt) {

        if(!globalData.isDemo){
            if(this.loadingLayer.active){
                if(globalData.finishGetData){
                    globalData.finishGetData = false;
                    // globalData.getSocket().disconnect();
                    cc.director.loadScene("MainScene");
    
                }
            }
        }
        else{
            if(this.forDemo){
                this.demoGenerateScore();
                this.forDemo=false;
                cc.director.loadScene("MainScene");
            }
        }
       

    },
    demoGenerateScore(){
        
        var generate =parseInt(Math.random() * (100 + 1) + 1);

        if(generate<80){
            globalData.maxPayOut = parseInt(Math.random() * (70 + 1 - 35) + 35);
        }
        else{
            globalData.maxPayOut = parseInt(Math.random() * (25 + 1 - 15) + 15);
        }


    },
    toggleMute(){
        if(this.musicToggle.isChecked){
            globalData.setSound(1);        
            cc.audioEngine.setMusicVolume(0.5);
            globalData.setEffectVolume(0.2);
            globalData.setRotateVolume(1);



        }
        else{
            globalData.setSound(0);        
            cc.audioEngine.setMusicVolume(0);
            globalData.setEffectVolume(0);
            globalData.setRotateVolume(0);

        }
    },
});
