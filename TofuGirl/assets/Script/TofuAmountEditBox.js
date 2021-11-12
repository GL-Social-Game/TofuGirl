import * as globalData from "GlobalData";

cc.Class({
    extends: cc.Component,
    properties: {
        editbox: cc.EditBox,

        expectedResultLabel: cc.Label,
        minimumTofuLabel: cc.Node,
    },

    onLoad: function () {
        this.main = cc.find("Canvas").getComponent("MainGame");

        // this.editbox.node.on('editing-did-began', this.startEdit, this);
        // this.editbox.node.on('editing-did-ended', this.editEnd, this);
        this.editbox.node.on('text-changed', this.changeText, this);
        // this.editbox.node.on('editing-return', this.returnEdit, this);

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
            this.expectedResultLabel.string = "MAX MULTIPLIER: " + this.GetExpectedResult(value);
            // cc.log(globalData.maxTofuAmount);
            this.main.startGameButton.interactable = true;

        }    
        else{
            this.main.startGameButton.interactable = false;
        }
    },


    changeText: function (editbox) {
        // The parameter of the callback is the editbox component.
        // cc.log(editbox.string);
        // do whatever you want with the editbox.
        var value = parseInt(editbox.string);
        // cc.log("end: "+value);
        if (value > 0) {
            globalData.maxTofuAmount = value;
            this.expectedResultLabel.string = "MAX MULTIPLIER: " + this.GetExpectedResult(value);
        }
        
        if(value >= 10){
            this.main.startGameButton.interactable = true;
            this.minimumTofuLabel.color = cc.color(187, 187, 187, 255);
        }    
        else{
            this.main.startGameButton.interactable = false;
            this.minimumTofuLabel.color = cc.color(187, 70, 70, 255);
        }
    },


    returnEdit: function (editbox) {
        // The parameter of the callback is the editbox component.
        // do whatever you want with the editbox.
        var value = parseInt(editbox.string);
        // cc.log("return: " +value);
        if (value > 0) {
            globalData.maxTofuAmount = value;
            this.expectedResultLabel.string = this.GetExpectedResult(value);
            // cc.log(globalData.maxTofuAmount);
            this.main.startGameButton.interactable = true;

        }    
        else{
            this.main.startGameButton.interactable = false;
        }
    },

    GetExpectedResult(value){
        var expectedResult = 0;
        for(var i = 1; i <= value; i++){
            if(i <= globalData.tofuSpawnedBoundary[0]){
                expectedResult+=globalData.tofuSpawnedMultiplier[0];
            }
            else if(i <= globalData.tofuSpawnedBoundary[1]){
                expectedResult+=globalData.tofuSpawnedMultiplier[1];
            }
            else if(i <= globalData.tofuSpawnedBoundary[2]){
                expectedResult+=globalData.tofuSpawnedMultiplier[2];
            }
            else if(i <= globalData.tofuSpawnedBoundary[3]){
                expectedResult+=globalData.tofuSpawnedMultiplier[3];
            }
            else if(i <= globalData.tofuSpawnedBoundary[4]){
                expectedResult+=globalData.tofuSpawnedMultiplier[4];
            }
            else if(i <= globalData.tofuSpawnedBoundary[5]){
                expectedResult+=globalData.tofuSpawnedMultiplier[5];
            }
            else if(i <= globalData.tofuSpawnedBoundary[6]){
                expectedResult+=globalData.tofuSpawnedMultiplier[6];
            }
            else if(i <= globalData.tofuSpawnedBoundary[7]){
                expectedResult+=globalData.tofuSpawnedMultiplier[7];
            }
            else if(i <= globalData.tofuSpawnedBoundary[8]){
                expectedResult+=globalData.tofuSpawnedMultiplier[8];
            }
            else if(i <= globalData.tofuSpawnedBoundary[9]){
                expectedResult+=globalData.tofuSpawnedMultiplier[9];
            }
            else if(i <= globalData.tofuSpawnedBoundary[10]){
                expectedResult+=globalData.tofuSpawnedMultiplier[10];
            }
            else if(i <= globalData.tofuSpawnedBoundary[11]){
                expectedResult+=globalData.tofuSpawnedMultiplier[11];
            }
            else if(i <= globalData.tofuSpawnedBoundary[12]){
                expectedResult+=globalData.tofuSpawnedMultiplier[12];
            }
            else if(i <= globalData.tofuSpawnedBoundary[13]){
                expectedResult+=globalData.tofuSpawnedMultiplier[13];
            }
            else{
                expectedResult+=globalData.tofuSpawnedMultiplier[14];
            }
        }

        return Math.round(expectedResult * 100) / 100;
    },

});
