// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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
        this.main = cc.find("Canvas");
        this.main = this.main.getComponent("MainGame");
        this.spawner=cc.find("Canvas/Spawner").getComponent("TofuSpawner");
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if(!self.tapToPlay.active&&self.isStart){
                if(!self.main.lose&&!self.main.jumping){
                    self.main.jump();
                }
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
     
        this.main.jump();
        this.canJump = true;
  
    },
    update (dt) {

        if(this.canJump){
            if (!this.tapToPlay.active && this.isStart) {
                if (!this.main.lose && !this.main.jumping) {
                    this.canJump = false;
                    this.scheduleOnce(function(){
                        this.autoJump();
                    },0.4);
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
