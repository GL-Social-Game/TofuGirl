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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // let c = this.node.getComponent(cc.Canvas);
        // c.fitHeight = true;
        // c.fitWidth = false;

        // let h = 1920 * cc.winSize.height / cc.winSize.width;

        // c.designResolution = new cc.Size(1920, h);
        // this.node.setContentSize(1920, h);

        // 适配解决方案
        let _canvas = cc.Canvas.instance;
// 设计分辨率比
        let _rateR = _canvas.designResolution.height/_canvas.designResolution.width;
        console.log("DesignResolution height: "+_canvas.designResolution.height+" || width: "+_canvas.designResolution.width);
// 显示分辨率比
        let _rateV = cc.winSize.height/cc.winSize.width;
        console.log("winSize height: "+cc.winSize.height+" || width: "+cc.winSize.width);
        console.log("winSize: rateR: "+_rateR+" rateV: "+_rateV);
        if (_rateV > _rateR)
        {
            _canvas.fitHeight = false;
            _canvas.fitWidth = true;
            console.log("winSize: fitWidth");
        }
        else
        {
            _canvas.fitHeight = true;
            _canvas.fitWidth = false;
            console.log("winSize: fitHeight");
        }
    },

    start () {
        // cc.view.setDesignResolutionSize(1080, 1920, cc.ResolutionPolicy.SHOW_ALL);

    },

    // update (dt) {},
});
