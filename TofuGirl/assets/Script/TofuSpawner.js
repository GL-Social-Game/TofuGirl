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
        bgImage:{
            default:null,
            type:cc.Node
        },
        bgExtent:{
            default:null,
            type:cc.Node
        },
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
        speed:300,
        main:{
            default:null,
            type:cc.Node,
        },
        multiplier:1,
        lastOne:false,
    },

    // LIFE-CYCLE CALLBACKS:
    spawnSpeedState() {
        if (this.currentSpawnCount <= this.state1) {

            if(this.currentSpawnCount == parseInt(this.state1)){
                var action = cc.tintTo(2,253,228,129);
                var action2 = cc.tintTo(2,253,228,129);
                this.bgImage.runAction(action);
                this.bgExtent.runAction(action2);

            }
            // cc.log("STATE1");
        }
        else if (this.currentSpawnCount > this.state1 && this.currentSpawnCount <= this.state2) {
            if(this.currentSpawnCount == parseInt(this.state2)){
                var action = cc.tintTo(2,194,99,163);
                var action2 = cc.tintTo(2,194,99,163);
                this.bgImage.runAction(action);
                this.bgExtent.runAction(action2);


            }
          
            // cc.log("STATE2");
            //#FDE481  253,228,129

        }
        else if (this.currentSpawnCount > this.state2 && this.currentSpawnCount <= this.state3) {
         
            if(this.currentSpawnCount ==  parseInt(this.state3)){
                var action = cc.tintTo(2,240,61,97);
                var action2 = cc.tintTo(2,240,61,97);
                this.bgImage.runAction(action);
                this.bgExtent.runAction(action2);

            }
            // cc.log("STATE3"); 

        }
        else if (this.currentSpawnCount > this.state3 && this.currentSpawnCount <=this.state4) {
            if(this.currentSpawnCount ==  parseInt(this.state4)){
                var action = cc.tintTo(2,112,41,18);
                var action2 = cc.tintTo(2,112,41,18);
                this.bgImage.runAction(action);
                this.bgExtent.runAction(action2);

            }
            // cc.log("STATE4"); 

        }
        else if (this.currentSpawnCount > this.state4 && this.currentSpawnCount < this.main.maxPayOut-1) {
         
            // cc.log("STATE5"); 

        }

        else {
            //Max payout state – three moves, guarantee lose
            this.lastOne=true;
            // cc.log("DIE");
        }
    },


    onLoad () {
        this.main = this.main.getComponent("MainGame");
        this.main.score.string = "x"+Math.round(this.main.accumulateMultiplier * 100) / 100;

      
    },
    generateState() {
        this.state1 = this.main.maxPayOut  * 20 / 100; //15
        this.state2 = this.main.maxPayOut * 40 / 100; //30
        this.state3 = this.main.maxPayOut * 60 / 100; //45
        this.state4 = this.main.maxPayOut* 80 / 100;
        this.state5 = this.main.maxPayOut;
    },

    start () {
        this.generateState();
        
    },

    spawn() {
        globalData.tofuSpawned++;
        // cc.log(globalData.tofuSpawned + " || " + globalData.maxTofuAmount);
        this.spawnSpeedState();
        // TODO: assign currentMultiplier based on checkpoint 
        var currentMultiplier;
        if(globalData.tofuSpawned <= 15){
            currentMultiplier = 0.1;
        }
        else if(globalData.tofuSpawned <= 20){
            currentMultiplier = 0.2;
        }
        else if(globalData.tofuSpawned <= 25){
            currentMultiplier = 0.3;
        }
        else if(globalData.tofuSpawned <= 30){
            currentMultiplier = 0.4;
        }
        else if(globalData.tofuSpawned <= 34){
            currentMultiplier = 0.5;
        }
        else if(globalData.tofuSpawned <= 36){
            currentMultiplier = 0.6;
        }
        else if(globalData.tofuSpawned <= 38){
            currentMultiplier = 0.7;
        }
        else if(globalData.tofuSpawned <= 40){
            currentMultiplier = 0.8;
        }
        else if(globalData.tofuSpawned <= 42){
            currentMultiplier = 0.9;
        }
        else if(globalData.tofuSpawned <= 46){
            currentMultiplier = 1;
        }
        else if(globalData.tofuSpawned <= 50){
            currentMultiplier = 1.5;
        }
        else if(globalData.tofuSpawned <= 58){
            currentMultiplier = 2;
        }
        else if(globalData.tofuSpawned <= 63){
            currentMultiplier = 3;
        }
        else if(globalData.tofuSpawned <= 68){
            currentMultiplier = 4;
        }
        else{
            currentMultiplier = 5;
        }
        // if (!globalData.showResult) {
        this.main.accumulateMultiplier += currentMultiplier;
        this.main.accumulateMultiplier = Math.round(this.main.accumulateMultiplier * 10) / 10;
        this.main.score.string = "x"+Math.round(this.main.accumulateMultiplier * 100) / 100;
        // }
        var random = parseInt(Math.random() * (1 + 1 - 0) + 0);
        var tofu = cc.instantiate(this.tofuPrefab);
        let rigidBody = tofu.getComponent(cc.RigidBody);
        tofu.parent = this.spawnLayer;
        tofu.getComponent("Tofu").multiplier = currentMultiplier;
        cc.log(this.main.accumulateMultiplier + "|| "+ globalData.MaxWinMultiplier);
        if(globalData.tofuSpawned % 5 == 0){
            tofu.getComponent("Tofu").enableCountIndicator();
        }
        if (globalData.tofuSpawned >= globalData.maxTofuAmount) {
            tofu.getComponent("Tofu").finalTofu = true;
        }
        if (this.main.accumulateMultiplier > globalData.MaxWinMultiplier) {
            tofu.getComponent("Tofu").isBoom = true;
        }
        else {
            tofu.getComponent("Tofu").isBoom = false;
        }
        if (random == 0) {//left
            tofu.position = cc.v2(this.left.x, this.startPositionY + 200);
            tofu.getComponent("Tofu").left = true;
            rigidBody.linearVelocity = cc.v2(this.speed, 0);
        }
        else {//right
            tofu.position = cc.v2(this.right.x, this.startPositionY + 200);
            tofu.getComponent("Tofu").left = false;
            rigidBody.linearVelocity = cc.v2(- this.speed, 0);
        }
        this.currentSpawnCount++;
        this.startPositionY = this.startPositionY + 200;

        
    }
});
