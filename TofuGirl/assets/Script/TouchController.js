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

        tapToPlay:{
            default:null,
            type:cc.Node,
        },
        isStart:false,
        playAnim:false,
        countdown:{
            default:null,
            type:cc.Node,
        },
        countdownString:{
            default:null,
            type:cc.Label,  
        },
        countdownTimer:4,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

        this.canJump = true;
        this.autoJumpEnable = true;
        this.main = cc.find("Canvas");
        this.main = this.main.getComponent("MainGame");
        this.spawner=cc.find("Canvas/Spawner").getComponent("TofuSpawner");
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if(!self.tapToPlay.active&&self.isStart){
            
            }
            else{
                if(self.tapToPlay.active){
                    self.scheduleOnce(function(){
                        self.spawner.spawn();
                        self.isStart = true;
                    },4);

                    self.scheduleOnce(function(){
                        self.main.startWhistle();
                    },3);
                }
               
                self.playAnim=true;
                self.tapToPlay.active=false;
            }
        });

    
    },

    autoJump(){
     
        if(this.autoJumpEnable){
            this.main.jump();
            this.canJump = true;
        }

  
    },

    cancelJump(){
        if(!this.tapToPlay.active && this.isStart){
            this.autoJumpEnable = false;
            if(!globalData.showResult){
                globalData.showResult = true;
                this.main.loseTrigger(false);
            }
        }
    },
    update (dt) {

        if(this.canJump){
            if (!this.tapToPlay.active && this.isStart) {
                if (!this.main.lose && !this.main.jumping) {
                    this.canJump = false;
                    this.scheduleOnce(function(){
                        this.autoJump();
                    },0.38);
                }
            }
        }


        if(this.playAnim){
            this.countdown.active=true;
            this.countdownTimer=this.countdownTimer - dt;
            this.countdownString.string = parseInt(this.countdownTimer);
            if(this.countdownTimer < 0){
                this.countdown.active=false;
                this.playAnim=false;
            }
        }
    },
});
