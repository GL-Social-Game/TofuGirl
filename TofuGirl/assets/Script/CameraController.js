// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        staticItemList:{
            default:[],
            type:[cc.Node],
        },
        firstTime:true,
        bgImage:{
            default:null,
            type:cc.Node,
        },
        table:{
            default:null,
            type:cc.Node,
        },
        plate:{
            default:null,
            type:cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
       this.moveValue = 0;
    },

   moveCamera(valueY){
        var action = cc.moveTo(0.2, cc.v2(0, valueY))
        for (var i = 0; i < this.staticItemList.length; i++) {
            if(this.staticItemList[i].active){
             var action2 = cc.moveTo(0.2, cc.v2(this.staticItemList[i].x, valueY));
             this.staticItemList[i].runAction(action2)
            }
            else{
             this.staticItemList[i].y=valueY;
            }
          
        }
        
        var actionBg=cc.moveTo(0.2,cc.v2(0,this.bgImage.y-5));
        this.bgImage.runAction(actionBg);
        this.main.fakeJump();
        this.node.runAction(action);
        if(valueY < 1000){
            this.table.runAction(cc.moveTo(0.2,cc.v2(0,this.table.y - this.moveValue)));
            this.plate.runAction(cc.moveTo(0.2,cc.v2(0,this.plate.y - this.moveValue)));
            this.moveValue=200;
        }
        // this.plate.runAction(cc.moveTo(0.2,cc.v2(0,this.plate.y-60)));

   },
    

   resetList(valueY){
    for (var i = 0; i < this.staticItemList.length; i++) {
        this.staticItemList[i].y = valueY;
    }
    this.moveValue = 140;
   },

    start () {
        this.main = cc.find("Canvas");
        this.main = this.main.getComponent("MainGame");
       this.node.y= cc.find("Canvas/TofuGirl").y+200;
       for(var i = 0;i<this.staticItemList.length;i++){
            this.staticItemList[i].y =  this.node.y;
        }

    },

    update (dt) {
         
    },
});
