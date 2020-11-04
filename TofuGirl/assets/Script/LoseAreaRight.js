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

        myParent:{
            default: null,        // The default value will be used only when the component attaching
            type:cc.RigidBody,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
   
    },

    onCollisionEnter: function (otherCollider, self) {
        if(otherCollider.node.name=="TofuGirl"){
            this.myParent.linearVelocity=cc.v2(0,0);
            cc.find("Canvas/TofuGirl").getComponent(cc.RigidBody).type =  cc.RigidBodyType.Kinematic;
            cc.find("Canvas/TofuGirl").getComponent(cc.RigidBody).fixedRotation =  true;
            cc.find("Canvas/TofuGirl").getComponent(cc.RigidBody).linearVelocity=cc.v2(0,0);

            cc.find("Canvas").getComponent("MainGame").lose = true;
            cc.find("Canvas").getComponent("MainGame").jumpRight();

        }
    },
   
    // update (dt) {},
});
