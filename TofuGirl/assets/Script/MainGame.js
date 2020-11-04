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

        girlObject:{
            default:null,
            type:cc.Node,
        },

        score:{
            default:null,
            type:cc.Label,
        },

        perfectString:{
            default:null,
            type:cc.Label,
        },
        jumpHeight:0,
        lose:false,
        currentScore:0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
    },

    jump(){
        let collider = this.girlObject.getComponent(cc.PhysicsBoxCollider);
        let jumpAction = cc.jumpTo(0.8,cc.v2(this.girlObject.x,this.girlObject.y),this.jumpHeight,1);
        this.girlObject.runAction(jumpAction);
      
    },

    jumpLeft(){
        this.girlObject.stopAllActions();
        let jumpAction = cc.jumpTo(0.3,cc.v2(this.girlObject.x-350,this.girlObject.y+100),90,1);
        this.girlObject.runAction(jumpAction);
        let collider = this.girlObject.getComponent(cc.PhysicsBoxCollider);

    },
    jumpRight(){
        this.girlObject.stopAllActions();
        let jumpAction = cc.jumpTo(0.3,cc.v2(this.girlObject.x+350,this.girlObject.y+100),90,1);
        this.girlObject.runAction(jumpAction);
        let collider = this.girlObject.getComponent(cc.PhysicsBoxCollider);

    },
    start () {

    },

    updateScore(perfect){
        this.currentScore++;
        this.score.string = this.currentScore;
        if(perfect){
            //perfect
            this.perfectString.string="Perfect!";
           
        }
        else{
            this.perfectString.string="No Perfect!";
        }
    },
    update (dt) {

        if(!this.lose){
            this.girlObject.x =0;
        }
    },
});
