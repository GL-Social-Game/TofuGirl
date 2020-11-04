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

        tofuPrefab:{
            default:null,
            type:cc.Prefab,
        },
        startPositionY:0,
        left:{
            default:null,
            type:cc.Node,
        },
        right:{
            default:null,
            type:cc.Node,
        },
        spawnLayer:{
            default:null,
            type:cc.Node,
        },
        currentSpawnCount:0,
        speed:250,
    },

    // LIFE-CYCLE CALLBACKS:
    spawnSpeedState() {
        if (this.currentSpawnCount <= this.state1) {
            this.speed = 300;
        }
        else if (this.currentSpawnCount > this.state1 && this.currentBallCount <= this.state2) {
            this.speed = 300;
        }
        else if (this.currentSpawnCount > this.state2 && this.currentBallCount <= this.state3) {
            this.speed = 350;

        }
        else if (this.currentSpawnCount > this.state3 && this.currentBallCount < this.main.maxPayOut) {
            this.speed = 400;

        }
        else {
            //Max payout state – three moves, guarantee lose
            this.speed = 450;

        }
    },


    // onLoad () {},
    generateState() {
        this.state1 = 60 * 30 / 100; //15
        this.state2 = 60 * 60 / 100; //30
        this.state3 = 60 * 90 / 100; //45
        this.state4 = 60;
    },

    start () {
        this.generateState();
        this.spawn();
        
    },

    spawn(){
        this.spawnSpeedState();
        var random = parseInt(Math.random() * (1 + 1 - 0) + 0);
        var tofu = cc.instantiate(this.tofuPrefab);
        let rigidBody = tofu.getComponent(cc.RigidBody);
        tofu.parent = this.spawnLayer;
        if(random==0){//left
            tofu.position = cc.v2(this.left.x,this.startPositionY+200);
            rigidBody.linearVelocity=cc.v2( this.speed,0);
        }
        else{//right
            tofu.position = cc.v2(this.right.x,this.startPositionY+200);
            rigidBody.linearVelocity=cc.v2(- this.speed,0);
        }
        this.currentSpawnCount++;
        this.startPositionY =this.startPositionY+200;
    }
    // update (dt) {},
});
