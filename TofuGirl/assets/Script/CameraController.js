// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        value:0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
       
    },

   moveCamera(valueY){
    if(this.value!=0){
        var action = cc.moveTo(0.5,cc.v2(0,valueY));
        this.node.runAction(action);
    }
    else{
        this.value = 1;
    }
   },
    


    start () {
       this.node.y= cc.find("Canvas/TofuGirl").y;

    },

    update (dt) {
         
    },
});
