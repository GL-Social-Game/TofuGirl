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
        rigidBody: {
            default: null,
            type: cc.RigidBody,
        },

        tofuAnimator: {
            default: null,
            type: cc.Animation
        },

        contacted: false,

        perfectAnimator: {
            default: null,
            type: cc.Animation
        },

        breakAnimator:{
            default: null,
            type: cc.Animation,
        },

        tofuSpriteNode:{
            default: null,
            type: cc.Node,
        },
        tofuBreakNode:{
            default:null,
            type:cc.Node,
        },
        tofuCrackSprite:{
            default:null,
            type:cc.SpriteFrame,
        },

        countIndicator:{
            default:null,
            type:cc.Node,
        },
        countIndicatorLabel:{
            default:[],
            type:[cc.Label],
        },

        perfect: false,
        left: true,
    },

    // LIFE-CYCLE CALLBACKS:
    onDestroy() {
        //
        cc.systemEvent.off("Perfect");
        cc.systemEvent.off("NotPerfect");


    },
    onLoad() {
        //this.generateScore();
        this.isBoom = false;
        this.finalTofu = false;
        // this.multiplier = 0;
        var self = this;
        cc.systemEvent.on("Perfect", function () {
            self.playTofu();
        });
        cc.systemEvent.on("NotPerfect", function () {
            self.resetTofu();
        });
    },
    start() {
        this.main = cc.find("Canvas").getComponent("MainGame");
        this.touchController = cc.find("Canvas/Main Camera/TouchController").getComponent("TouchController");


    },
    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (!this.main.lose) {
            if (!this.contacted) {
                if (globalData.currentValueSound > 6) {
                    globalData.currentValueSound = 6;
                }
                if (otherCollider.node.name == "TofuGirl") {
                    this.tofuAnimator.play("TofuHit");
                    this.rigidBody.linearVelocity = cc.v2(0, 0);

                    if (!this.isBoom) {
                        if(globalData.tofuSpawned == 1){
                            this.main.stopButton.active = true;
                        }
                        // for(let i = 0; i < this.main.countIndicator.length; i++){
                        //     if (globalData.tofuSpawned == 1) {
                        //         this.main.countIndicator[i].y = this.main.girlObject.y - 1407;
                        //         // cc.log("1 here");
                        //     }
                        //     else {
                        //         // cc.log("girl" + this.main.girlObject.y);
                        //         this.main.countIndicator[i].y += 200;
                        //         // cc.log("more than 1 here");
                        //     }
                        //     this.main.countIndicatorLabel[i].string = globalData.tofuSpawned;
                        // }
                        var crackChance = Math.random();
                        var canCrack = crackChance >= 0.8;
                        if(canCrack){
                            // cc.log("can crack");
                            this.scheduleOnce(function(){
                                // cc.log("cracked");
                                this.tofuSpriteNode.getComponent(cc.Sprite).spriteFrame = this.tofuCrackSprite;
                            },0.5);
                        }
                        if (this.node.x > -20 && this.node.x < 20) {
                            // this.main.updateScore(true,this.node);
                            // this.perfect=true;
                            // cc.systemEvent.emit("Perfect");
                            // globalData.currentValueSound++;
                            // this.main.perfectSoundFX(globalData.currentValueSound);
                            // this.scheduleOnce(function(){
                            //     this.node.x =0;
                            // },0.01)


                            cc.systemEvent.emit("NotPerfect");
                            this.main.almostMissSoundFX();
                            globalData.currentValueSound = 0;
                            this.main.updateScore(false, this.multiplier);

                        }
                        else {
                            cc.systemEvent.emit("NotPerfect");
                            this.main.almostMissSoundFX();
                            globalData.currentValueSound = 0;
                            this.main.updateScore(false, this.multiplier);

                        }
                        if (this.node.x > 100) {
                            this.main.characterAnimator.play("Senget");
                            this.main.almostMissSoundFX();
                            globalData.currentValueSound = 0;

                        }
                        else if (this.node.x < -100) {
                            this.main.characterAnimator.play("Senget");
                            this.main.almostMissSoundFX();
                            globalData.currentValueSound = 0;
                        }

                        // Check final tofu then end game
                        if (this.finalTofu) {
                            // if (globalData.tofuSpawned > globalData.maxTofuAmount) {
                            if (!globalData.showResult) {
                                if (this.finalTofu == globalData.maxTofuAmount) {
                                    this.touchController.cancelJump();
                                    globalData.showResult = true;
                                    cc.audioEngine.playMusic(this.main.winBGM, false);
                                    this.main.canPlaySFX = false;
                                    // this.scheduleOnce(function () {
                                    // }, 0.21);
                                }
                                else {
                                    this.scheduleOnce(function () {
                                        globalData.showResult = true;
                                        this.main.loseTrigger(false);
                                    }, 0.21);
                                }
                            }
                        }
                    }
                    else {
                        this.breakTofu();
                        this.touchController.autoJumpEnable = false;
                        this.main.lose = true;
                        this.main.currentScore = 0;
                        this.main.total_add = 0;
                        // this.main.accumulateMultiplier = 0;
                        this.main.updateScore(false, 0);
                        if(!globalData.showResult){
                            globalData.showResult = true;
                            this.main.loseTrigger(true);
                        }

                    }

                    if (this.touchController.autoJumpEnable) {
                        // if(globalData.tofuSpawned <globalData.MaxWinMultiplier){
                        if (this.main.accumulateMultiplier < globalData.MaxWinMultiplier) {
                            cc.find("Canvas/Spawner").getComponent("TofuSpawner").spawn();
                        }
                    }
                    this.main.jumping = false;
                    cc.find("Canvas/Main Camera").getComponent("CameraController").moveCamera(otherCollider.node.y);
                    this.contacted = true;
                }
            }

            
        }



    },

    enableCountIndicator(){
        this.countIndicator.active = true;
        for( let i = 0; i < this.countIndicatorLabel.length; i ++){
            this.countIndicatorLabel[i].string = globalData.tofuSpawned;
        }
    },
    breakTofu(){
        // this.tofuBreakNode.active = true;
        this.tofuSpriteNode.active = false;
        this.breakAnimator.play("TofuBreak");
        let charSprite = cc.find("Canvas/TofuGirl/CharacterSprite");
        // charSprite = this.main.dropSprite;
        // cc.log(charSprite);
        this.scheduleOnce(function(){
            let drop = cc.jumpTo(0.8,cc.v2(this.main.girlObject.x,this.main.girlObject.y-1200),0,0);
            let spin = new cc.RotateBy(0.8, 1080);
            this.main.girlObject.runAction(drop);
            this.main.girlObject.runAction(spin);
        },0.1);
    },
    resetTofu() {
        this.perfect = false;
    },
    playTofu() {
        if (this.perfect) {
            this.perfectAnimator.play("PerfectTofu");
        }
    },
    update(dt) {
        if (this.main.lose || !this.touchController.autoJumpEnable) {
            this.rigidBody.linearVelocity = cc.v2(0, 0);
        }

        if (!this.contacted && !this.main.lose) {
            if (!this.left) {
                if (this.node.x < -400) {
                    this.main.lose = true;
                    if(!globalData.showResult){
                        globalData.showResult = true;
                        this.main.loseTrigger(false);
                    }
                }
            }
            else {
                if (this.node.x > 400) {
                    this.main.lose = true;
                    if(!globalData.showResult){
                        globalData.showResult = true;
                        this.main.loseTrigger(false);
                    }
                }
            }
        }


    },
});
