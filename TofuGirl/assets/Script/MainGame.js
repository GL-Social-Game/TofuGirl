// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import * as globalData from "GlobalData";
import * as ecrypt from "ecrypt";

cc.Class({
    extends: cc.Component,

    properties: {
        chooseTofuLayer:{
            default:null,
            type:cc.Node,
        },
        startGameButton:{
            default:null,
            type:cc.Button,
        },
        loseText:{
            default:null,
            type:cc.Label,
        },
        animationText:{
            default:null,
            type:cc.Animation,
        },
        perfectAnimationText:{
            default:null,
            type:cc.Animation,
        },

        perfectText2:{
            default:null,
            type:cc.Label,
        },
        animationLabel:{
            default:null,
            type:cc.Label,
        },
        perfectAnimationLabel:{
            default:null,
            type:cc.Label,
        },
        jumpSound:{
            default:null,
            type:cc.AudioClip
        },
        loseSound:{
            default:null,
            type:cc.AudioClip
        },
        perfectSound:{
            default:[],
            type:[cc.AudioClip]
        },
        almostMissSound:{
            default:null,
            type:cc.AudioClip
        },
        whistleSound:{
            default:null,
            type:cc.AudioClip
        },
        bgm:{
            default:null,
            type:cc.AudioClip
        },
        winBGM:{
            default:null,
            type:cc.AudioClip
        },
        loadingLayer:{
            default:null,
            type:cc.Node,
        },
        girlObject:{
            default:null,
            type:cc.Node,
        },

        score:{
            default:null,
            type:cc.Label,
        },
        flash:{
            default:null,
            type:cc.Node,  
        },
        perfectString:{
            default:null,
            type:cc.Label,
        },
        jumpHeight:0,
        lose:false,
        currentScore:0,
        maxPayOut:0,
        jumping:false,
        endGameLayer:{
            default:null,
            type:cc.Node,
        },
        endGameScoreLabel:{
            default:null,
            type:cc.Label,
        },
        totalScore:0,
        generatingBalance:false,
        isRestarting:false,
        replayButton:{
            default:null,
            type:cc.Button,
        },
        balance:{
            default:null,
            type:cc.Label,
        },

        button_click:{
            default:null,
            type:cc.AudioClip
        },
    
        musicToggle:{
            default:null,
            type:cc.Toggle
        },

        drop_effect:{
            default:null,
            type:cc.Prefab
        },

        textParticle:{
            default:null,
            type:cc.Prefab
        },
        perfect_particle:{
            default:null,
            type:cc.Prefab
        },

        particleLayer:{
            default:null,
            type:cc.Node
        },

        questionMark:{
            default:null,
            type:cc.Node
        },

        characterAnimator:{
            default:null,
            type:cc.Animation
        },
        total_add:0,
        currentBettingLabel:{
            default:null,
            type:cc.Label
        },

        winAmountLabel:{
            default:null,
            type:cc.Label
        },

        resultWinAmountLabel:{
            default:null,
            type:cc.Label
        },

        
        resultScore:{
            default:null,
            type:cc.Label
        },

        resultBalance:{
            default:null,
            type:cc.Label
        },

        stopOnce:false,
        stopButton:{
            default:null,
            type:cc.Node,
        },

        dropSprite:{
            default:null,
            type:cc.SpriteFrame,
        },

        countIndicator:{
            default:[],
            type:[cc.Node],
        },
        countIndicatorLabel:{
            default:[],
            type:[cc.Label],
        },

        endGameCalculationLabel:{
            default:null,
            type:cc.Label,
        },
        message:{
			default:null,
			type:cc.Label
		},
        prompt:{
            default:null,
            type:cc.Node
        },
        canPlaySFX: true,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // if(cc.sys.isMobile){
		// 	cc.view.resizeWithBrowserSize(true);
		// 	cc.view.setDesignResolutionSize(1080, 1920, cc.ResolutionPolicy.SHOW_ALL);
		// }else{
		// 	this.node.getComponent(cc.Canvas).fitHeight = true;
		// 	this.node.getComponent(cc.Canvas).fitWidth = true;
        // }
        for(let i = 0; i < this.countIndicator.length; i++){
            this.countIndicator[i].y = 10000;
            this.countIndicatorLabel[i].string = "0";
        }
        globalData.tofuSpawned = 0;
        globalData.showResult = false;
        this.startGameButton.interactable = false;
        // globalData.canStartGame = false;
        globalData.maxTofuAmount = 0;
        this.calculateBetAmount();
        this.accumulateMultiplier = 0;
        this.currentWinMultiplier = 0;
        this.multiplier = globalData.getMultiplier();
        this.maxPayOut= globalData.maxPayOut;
        globalData.currentValueSound=-1;

        if (globalData.getSound() == 0) {
            this.musicToggle.isChecked = false; 
        }
        // cc.log(this.maxPayOut);
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
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().enabledAccumulator = true;
        this.mainSceneBgm = cc.audioEngine.playMusic(this.bgm, true);



    },

    //#region BET TOFU AMOUNT
    setMaxTofuAmount(event, value){
        globalData.maxTofuAmount = value;
        this.startGameButton.interactable = true;
    },
    setMaxTofuAmountManual(event){
        if (value > 0 && value <= 105) {
            globalData.maxTofuAmount = value;
            cc.log(globalData.maxTofuAmount);
            this.startGameButton.interactable = true;

        }        
    },
    startGame(){
        //globalData.canStartGame = true;
        this.endGameCalculationLabel.enabled = false;
        this.chooseTofuLayer.active = false;
        if(globalData.isDemo){
            var max = 100;
            var min = 0;
            globalData.MaxWinMultiplier = parseInt(Math.random() * (max + 1 - min) + min);;
            if (globalData.MaxWinMultiplier <= 1) {
                globalData.MaxWinMultiplier = Math.round((Math.random() * (1 + 1 - 0) + 0) * 10) / 10;
            }
        }
    },
    //#endregion
    
    //#region  particle
    playParticle(x, y) {
        if (this.particle != null)
            this.particle.destroy();
      
        this.particle = cc.instantiate(this.drop_effect);
        this.particle.parent = this.particleLayer;
        this.particle.position = cc.v2(x, y);
    },
 
    playParticlePerfect(x, y) {
        if (this.particle2 != null)
            this.particle2.destroy();
      
        var action1=cc.fadeIn(0.1);
        var action2=cc.fadeOut(0.1);
        var action3=cc.sequence(action1,action2);
        this.flash.runAction(action3);
        this.particle2 = cc.instantiate(this.perfect_particle);
        this.particle2.parent = this.particleLayer;
        this.particle2.position = cc.v2(x, y);
    },
    //#endregion
    //#region  JUMP
    fakeJump(){
        let jumpAction = cc.jumpTo(0.4,cc.v2(this.girlObject.x,this.girlObject.y),80,1);
        let rigidBody= this.girlObject.getComponent(cc.RigidBody);
        rigidBody.gravityScale=1;
        this.girlObject.runAction(jumpAction);
      

    },
    jump(){
        this.jumping=true;
        if(globalData.tofuSpawned % 3 == 0){
            this.characterAnimator.play("Terbalik Jump");
        }
        else{
            this.characterAnimator.play("Jumping");
        }
        this.playEffect(this.jumpSound, globalData.getRotateVolume());
        let rigidBody= this.girlObject.getComponent(cc.RigidBody);
        let jumpAction = cc.jumpTo(0.4,cc.v2(this.girlObject.x,this.girlObject.y+this.jumpHeight),200,1);
        rigidBody.gravityScale=1;
        this.girlObject.runAction(jumpAction);
        //  collider.active=false;
         this.scheduleOnce(function(){
            this.girlObject.stopAllActions();
            // cc.log("stop 1");
            rigidBody.gravityScale=30;
        },0.35);
      
    },

    jumpLeft(){
        this.girlObject.stopAllActions();
        // cc.log("stop 2");
        this.characterAnimator.play("JumpLeft");
        this.playEffect(this.loseSound, globalData.getEffectVolume());
        let jumpAction = cc.jumpTo(0.2,cc.v2(this.girlObject.x-350,this.girlObject.y+50),40,1);
        this.playParticle(this.girlObject.x+40,this.girlObject.y);
        this.girlObject.runAction(jumpAction);
        this.questionMark.active=true;
        this.sendEndResult();
        this.scheduleOnce(function(){
            // if(cc.find("Canvas/Spawner").getComponent("TofuSpawner").lastOne){
            //     cc.find("Canvas/Main Camera").getComponent("CameraController").resetList(this.girlObject.y+220.5);
            // }
            if(this.total_add>0){
                this.loseText.string="Congratulations!";
            }
            else{
                this.loseText.string="Thank You For Playing!";
            }
            this.endGameScoreLabel.string = Math.round((this.total_add) * 100) / 100;
            // this.endGameCalculationLabel.string = "(" + this.currentBetting + this.endGameScoreLabel.string + ")";
            this.endGameLayer.active = true;
            if(globalData.settings.balance>=this.currentBetting){
                this.replayButton.interactable = true;
            }
        },0.5);
    },

    loseTrigger(isBoom){
        this.questionMark.active=true;
        this.sendEndResult();
        this.scheduleOnce(function(){
            if(this.total_add>0){
                this.loseText.string="Congratulations!";
                cc.audioEngine.playMusic(this.winBGM, false);
                this.canPlaySFX = false;
            }
            else{
                this.playEffect(this.loseSound, globalData.getRotateVolume());
                this.loseText.string="Thank You For Playing!";
            }
            this.endGameScoreLabel.string = Math.round((this.total_add) * 100) / 100;
            
            this.endGameLayer.active = true;
            if(isBoom){
                this.resultScore.string = "Boom";
            }
            else{
                this.resultScore.string = "x" + Math.round(this.currentWinMultiplier*100)/100;
                this.endGameCalculationLabel.enabled = true;
                this.endGameCalculationLabel.string = "(" + this.currentBetting + this.resultScore.string + ")";
            }
            if(globalData.settings.balance>=this.currentBetting){
                this.replayButton.interactable = true;
            }
        },0.5);
    },
    jumpRight(){
        this.girlObject.stopAllActions();
        // cc.log("stop 3");
        this.characterAnimator.play("JumpRight");
        this.playEffect(this.loseSound, globalData.getRotateVolume());
        let jumpAction = cc.jumpTo(0.2,cc.v2(this.girlObject.x+350,this.girlObject.y+50),40,1);
        this.girlObject.runAction(jumpAction);
        let collider = this.girlObject.getComponent(cc.PhysicsBoxCollider);
        this.questionMark.active=true;
        this.playParticle(this.girlObject.x-40,this.girlObject.y);
        this.sendEndResult();
        this.scheduleOnce(function(){
            // if(cc.find("Canvas/Spawner").getComponent("TofuSpawner").lastOne){
            //     cc.find("Canvas/Main Camera").getComponent("CameraController").resetList(this.girlObject.y+220.5);
            // }
            if(this.total_add>0){
                this.loseText.string="Congratulations!";
            }
            else{
                this.loseText.string="Thank You For Playing!";
            }
            this.endGameScoreLabel.string = Math.round((this.total_add) * 100) / 100;
            // this.endGameCalculationLabel.string = "(" + this.currentBetting + this.endGameScoreLabel.string + ")";

            this.endGameLayer.active = true;
            if(globalData.settings.balance>=this.currentBetting){
                this.replayButton.interactable = true;
            }
        },0.5);
    },
       //#endregion

    sendEndResult(){
        if(!globalData.isDemo){
            var emit_result = {
                'host_id':globalData.host_id,
                'access_token':globalData.access_token,
                'ticket_id': globalData.ticket_id,
                'result': this.total_add,
                'key': "TofuGirl Score: " + this.total_add,
                'game_code': globalData.game_code,
                'description': "Send actual result to server",
                'user_id': globalData.settings.user_id,
                'api_url':globalData.api_Url,
                "is_apollo_v3": globalData.is_apollo_v3,
            };
            if(globalData.isEncrypt){
                emit_result = ecrypt.encrypt(JSON.stringify(emit_result));
            }
            if(!globalData.isKicked){
                globalData.getSocket().emit('result', emit_result);
            }
        }
        else{
            globalData.settings.balance+=this.total_add;
        }
        this.generatingBalance = true;

    },

    restartGame(){
        if(!globalData.isDemo){
            var emit_result = {
                'host_id':globalData.host_id,
                'access_token':globalData.access_token,
                'game_code': globalData.game_code,
                'betAmount': this.currentBetting,
                "key": "TofuGirl bet with these index 1st",
                "description": "bet",
                "user_id": globalData.settings.user_id,
                "scorePerOne" : globalData.getMultiplier(),
                'api_url':globalData.api_Url,
                "currentBetSlot" :globalData.getBetAmountIndex(),
                "is_apollo_v3": globalData.is_apollo_v3,
            };
            if(globalData.isEncrypt){
                emit_result = ecrypt.encrypt(JSON.stringify(emit_result));
            }
            if (!globalData.isKicked) {
                globalData.getSocket().emit('bet', emit_result);
            }
        }
        else{
            var max = 100;
            var min = 0;
            globalData.MaxWinMultiplier = parseInt(Math.random() * (max + 1 - min) + min);;
            if (globalData.MaxWinMultiplier <= 1) {
                globalData.MaxWinMultiplier = Math.round((Math.random() * (1 + 1 - 0) + 0) * 10) / 10;
            }
            globalData.settings.balance -=this.currentBetting;
        }
        this.loadingLayer.opacity = 255;
        this.loadingLayer.active = true;
        this.isRestarting = true;
        globalData.tofuSpawned = 0;
    },

    
    backToHome(){
        this.loadingLayer.active = true;
        this.stopBGM();
        // globalData.getSocket().disconnect();
        cc.director.loadScene("StartScene");
    },

    start () {
        this.balance.string=Math.round((globalData.settings.balance) * 100) / 100;
        this.touchController=cc.find("Canvas/Main Camera/TouchController").getComponent("TouchController");
    },

    updateScore(perfect,value){
        if(perfect){
            //perfect
            this.perfectString.string="Perfect!";
            this.playParticle(this.girlObject.x,this.girlObject.y-120);
            this.playParticlePerfect(this.girlObject.x,this.girlObject.y);
            this.scheduleOnce(function(){
                if(!this.lose){
                    if (!globalData.showResult) {
                        this.currentScore++;
                        this.currentWinMultiplier += value;
                        this.perfectText2.string="(+"+ Math.round((this.multiplier*10/100)*10000)/10000+")";
                        this.perfectAnimationLabel.string="+"+ Math.round((this.multiplier*90/100)*10000)/10000;
                        // this.perfectAnimationText.play("TextAnimation");
                        this.total_add = this.currentBetting * this.currentWinMultiplier;
                        this.winAmountLabel.string = "x"+ Math.round(this.currentWinMultiplier*100)/100;
                        this.resultScore.string = Math.round(this.currentWinMultiplier*100)/100;
                        this.resultWinAmountLabel.string=Math.round(this.total_add*100)/100;
                    }
                }
            },0.2);
           
        }
        else{
            this.perfectString.string="No Perfect!";
            this.playParticle(this.girlObject.x,this.girlObject.y-120);
            this.scheduleOnce(function(){
                if(!this.lose){
                    if (!globalData.showResult) {
                        this.currentScore++;
                        this.currentWinMultiplier += value;
                        this.animationLabel.string="+"+ Math.round((this.multiplier*100/100)*1000)/1000;
                        // this.animationText.play("TextAnimation");
                        this.total_add = this.currentBetting *  this.currentWinMultiplier;
                        this.winAmountLabel.string= "x"+Math.round(this.currentWinMultiplier*100)/100;
                        this.resultScore.string = Math.round(this.currentWinMultiplier*100)/100;
                        this.resultWinAmountLabel.string=Math.round(this.total_add*100)/100;
                    }
                }
            },0.2);
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
   
    update (dt) {
        if(globalData.isKicked){
			this.message.string = globalData.kickMessage;
            this.prompt.active = true;
		}
        if (!this.touchController.autoJumpEnable) {
            if (!this.stopOnce) {
                this.stopOnce = true;
                this.girlObject.stopAllActions();
                // cc.log("stop 4");
                let rigidBody = this.girlObject.getComponent(cc.RigidBody);
                rigidBody.type = cc.RigidBodyType.Static;
                this.characterAnimator.pause();
            }
        }

        if(!this.lose){
            this.girlObject.x =0;
        }

        if(this.isRestarting){
            if(!globalData.isDemo){
                if(globalData.finishGetData){
                    this.isRestarting = false;
                    globalData.finishGetData=false;
                    // globalData.getSocket().disconnect();
                    cc.director.loadScene("MainScene");
                }
            }
            else{
                this.demoGenerateScore();
                cc.director.loadScene("MainScene");
            }
          
        }

        if(this.generatingBalance){
            if(!globalData.isDemo){
                if(globalData.finishGeneratingBalance){
                    globalData.finishGeneratingBalance =false;
                    this.generatingBalance = false;
                    this.replayButton.node.active=true;
                    this.balance.string=Math.round((globalData.settings.balance) * 100) / 100;
                    this.resultBalance.string=Math.round((globalData.settings.balance) * 100) / 100;
    
                }
            }
            else{
                this.replayButton.node.active=true;
                this.balance.string=Math.round((globalData.settings.balance) * 100) / 100;
                this.resultBalance.string=Math.round((globalData.settings.balance) * 100) / 100;
                this.loadingLayer.active = false;
                this.generatingBalance = false;
            }
            
        }
    },
    blankScreen(){
        if (globalData.settings.lobby_url != null && globalData.settings.lobby_url != "") {
            window.open(globalData.settings.lobby_url, "_self");
        } else {
            window.open("about:blank", "_self");
        }
        // window.location.href=globalData.settings.lobby_url;
    },
    calculateBetAmount(){
        this.maintBetOption = globalData.getBetSelection();
        if (this.maintBetOption == 0) {
            this.myValue = 1;
        }
        if (this.maintBetOption == 1) {
            this.myValue = 5;

        }
        if (this.maintBetOption == 2) {
            this.myValue = 10;
        }
        if (this.maintBetOption == 3) {
            this.myValue = 20;
        }

        if(globalData.getBetAmountIndex() == 0){
            this.currentBetting = ((1*this.myValue));
        }
        else if(globalData.getBetAmountIndex()==1){
            this.currentBetting = ((1*this.myValue))*2;
        }
        else if(globalData.getBetAmountIndex()==2){
            this.currentBetting = ((1*this.myValue))*3;
        }
        else{
            this.currentBetting = ((1*this.myValue)/(5 - globalData.getBetAmountIndex()))*10;
        }

        this.currentBettingLabel.string=this.currentBetting;
    },
    //#region  sound
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
    stopBGM(){
        cc.audioEngine.stopMusic();
    },

    buttonClickSound(){
        this.playEffect(this.button_click, globalData.getEffectVolume());
    },

    startWhistle(){
        this.playEffect(this.whistleSound, globalData.getRotateVolume());
    },
    perfectSoundFX(value){
        this.playEffect(this.perfectSound[value], globalData.getRotateVolume());
    },
    almostMissSoundFX(){
        this.playEffect(this.almostMissSound, globalData.getRotateVolume());
    },
    playEffect:function(audio, volume){
        if(this.canPlaySFX){
            this.effect_id2 = cc.audioEngine.play(audio, false);
            if(globalData.getSound() == 0 ){
                cc.audioEngine.setVolume(this.effect_id2, 0.0);
            }else if(volume != null){
                cc.audioEngine.setVolume(this.effect_id2, volume);
            }
        }
        return this.effect_id2;
    },
    //#endregion

    fullScreen(){
        if(cc.screen.fullScreen()){
            cc.screen.exitFullScreen();
        }
        else{
            cc.screen.requestFullScreen();
        }

    },



});
