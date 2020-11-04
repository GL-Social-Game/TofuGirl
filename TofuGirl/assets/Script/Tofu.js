// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
      rigidBody:{
          default:null,
          type:cc.RigidBody,
      },

      contacted:false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    
    },

    start () {
        this.main = cc.find("Canvas").getComponent("MainGame");
    },
    onBeginContact: function (contact, selfCollider, otherCollider) {
        if(!cc.find("Canvas").getComponent("MainGame").lose){
            if(!this.contacted){
                if(otherCollider.node.name=="TofuGirl"){
                    this.rigidBody.linearVelocity=cc.v2(0,0);
                    if(this.node.x>-20 && this.node.x<20){
                        this.main.updateScore(true,this.node);
                        this.scheduleOnce(function(){
                            this.node.x =0;
                        },0.01)
                        
                    }
                    else{
                        this.main.updateScore(false);
                        cc.log(this.node.x);

                    }
                    cc.find("Canvas/Spawner").getComponent("TofuSpawner").spawn();
                    cc.find("Canvas/Main Camera").getComponent("CameraController").moveCamera(otherCollider.node.y);
                    this.contacted=true;
                }
            }
        }
      
     

    },


    update (dt) {
        if(this.main.lose){
            this.rigidBody.linearVelocity=cc.v2(0,0);
        }

    },
});
