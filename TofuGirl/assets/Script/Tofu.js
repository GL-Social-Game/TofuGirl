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
      rigidBody:{
          default:null,
          type:cc.RigidBody,
      },

      tofuAnimator:{
        default:null,
        type:cc.Animation
    },
      contacted:false,

      perfectAnimator:{
        default:null,
        type:cc.Animation
      },

      
      perfect:false,
      left:true,
    },

    // LIFE-CYCLE CALLBACKS:
    onDestroy(){
        //
        cc.systemEvent.off("Perfect");
        cc.systemEvent.off("NotPerfect");


    },
    onLoad () {
        //this.generateScore();
        var self =this;
        cc.systemEvent.on("Perfect", function() {
            self.playTofu();
            });
        cc.systemEvent.on("NotPerfect", function() {
                self.resetTofu();
                });
    },
    start () {
        this.main = cc.find("Canvas").getComponent("MainGame");

    },
    onBeginContact: function (contact, selfCollider, otherCollider) {
        if(!this.main.lose){
            if(!this.contacted){
                if(globalData.currentValueSound>6){
                    globalData.currentValueSound=6;
                }
                if(otherCollider.node.name=="TofuGirl"){
                    this.tofuAnimator.play("TofuHit");
                    this.rigidBody.linearVelocity=cc.v2(0,0);
                    if(this.node.x>-20 && this.node.x<20){
                        this.main.updateScore(true,this.node);
                        this.perfect=true;
                        cc.systemEvent.emit("Perfect");
                        globalData.currentValueSound++;
                        this.main.perfectSoundFX(globalData.currentValueSound);
                        this.scheduleOnce(function(){
                            this.node.x =0;
                        },0.01)
                        
                    }
                    else{
                        cc.systemEvent.emit("NotPerfect");
                        this.main.almostMissSoundFX();
                        globalData.currentValueSound=0;
                        this.main.updateScore(false);

                    }
                    if(this.node.x>100){
                        this.main.characterAnimator.play("Senget");
                        this.main.almostMissSoundFX();
                        globalData.currentValueSound=0;

                    }
                    else if(this.node.x<-100){
                        this.main.characterAnimator.play("Senget");
                        this.main.almostMissSoundFX();
                        globalData.currentValueSound=0;
                    }
                    cc.find("Canvas/Spawner").getComponent("TofuSpawner").spawn();
                    cc.find("Canvas").getComponent("MainGame").jumping=false;
                    cc.find("Canvas/Main Camera").getComponent("CameraController").moveCamera(otherCollider.node.y);
                    this.contacted=true;
                }
            }
        }
      
     

    },

    resetTofu(){
        this.perfect=false;
    },
    playTofu(){
        if(this.perfect){
            this.perfectAnimator.play("PerfectTofu");
        }
    },
    update (dt) {
        if(this.main.lose){
            this.rigidBody.linearVelocity=cc.v2(0,0);
        }

        if(!this.contacted&&!this.main.lose){
            if(!this.left){
                if(this.node.x<-400){
                    cc.find("Canvas").getComponent("MainGame").lose = true;
                    cc.find("Canvas").getComponent("MainGame").loseTrigger();
                }
            }
            else{
                if(this.node.x>400){
                    cc.find("Canvas").getComponent("MainGame").lose = true;
                    cc.find("Canvas").getComponent("MainGame").loseTrigger();
                }
            }
        }
       

    },
});
