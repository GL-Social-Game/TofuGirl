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
                    }
                    else {
                        this.breakTofu();
                        this.touchController.autoJumpEnable = false;
                        this.main.lose = true;
                        this.main.currentScore = 0;
                        this.main.total_add = 0;
                        // this.main.accumulateMultiplier = 0;
                        this.main.loseTrigger(true);
                        this.main.updateScore(false, 0);

                    }

                    if (this.touchController.autoJumpEnable) {
                        cc.find("Canvas/Spawner").getComponent("TofuSpawner").spawn();
                    }
                    this.main.jumping = false;
                    cc.find("Canvas/Main Camera").getComponent("CameraController").moveCamera(otherCollider.node.y);
                    this.contacted = true;
                }
            }
        }



    },

    breakTofu(){
        // this.tofuBreakNode.active = true;
        this.tofuSpriteNode.active = false;
        this.breakAnimator.play("TofuBreak");
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
                    this.main.loseTrigger(false);
                }
            }
            else {
                if (this.node.x > 400) {
                    this.main.lose = true;
                    this.main.loseTrigger(false);
                }
            }
        }


    },
});
