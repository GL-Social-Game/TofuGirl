import * as globalData from "GlobalData";

cc.Class({
    extends: cc.Component,
    properties: {
        editbox: cc.EditBox
    },

    onLoad: function () {
        this.main = cc.find("Canvas").getComponent("MainGame");

        // this.editbox.node.on('editing-did-began', this.startEdit, this);
        this.editbox.node.on('editing-did-ended', this.editEnd, this);
        this.editbox.node.on('text-changed', this.changeText, this);
        this.editbox.node.on('editing-return', this.returnEdit, this);

    },

    startEdit: function (editbox) {
        // The parameter of the callback is the editbox component.
        // do whatever you want with the editbox.


    },

    editEnd: function (editbox) {
        // The parameter of the callback is the editbox component.
        // do whatever you want with the editbox.
        
        var value = parseInt(editbox.string);
        // cc.log("end: "+value);
        if (value > 0) {
            globalData.maxTofuAmount = value;
            // cc.log(globalData.maxTofuAmount);
            this.main.startGameButton.interactable = true;

        }    
    },


    changeText: function (editbox) {
        // The parameter of the callback is the editbox component.
        var value = parseInt(editbox.string);
        cc.log(editbox.string);
        if(value > 99){
            editbox.string = 99;
        }
        // do whatever you want with the editbox.
    },


    returnEdit: function (editbox) {
        // The parameter of the callback is the editbox component.
        // do whatever you want with the editbox.
        var value = parseInt(editbox.string);
        // cc.log("return: " +value);
        if (value > 0) {
            globalData.maxTofuAmount = value;
            // cc.log(globalData.maxTofuAmount);
            this.main.startGameButton.interactable = true;

        }    
    },
});
