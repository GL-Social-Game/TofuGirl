import * as globalData from "GlobalData";

cc.Class({
    extends: cc.Component,

    properties: {

		playBtn:{

			default:null,
			type:cc.Button

		},
		bet_options:{
			default:[],
			type:[cc.Node]
		},

		selectedBet:{
			default:[],
			type:[cc.Node]
		},

    },
    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
      
		this.selectedBetOption = globalData.getBetSelection();
		// if (!(this.playBtn==null)) {
		// 	this.playBtn.interactable = false;
		// 	this.playBtn.node.opacity = 160;
		// }
	
    },

	// update (dt) {},
	
	setOptionsAmount(index, amount){
		this.label = this.bet_options[index].getChildByName("Label").getComponent(cc.Label);
		this.label.string = amount;
	},
	setSprite(){
		for(let i = 0; i < this.selectedBet.length; i++){
			if(i == this.selectedBetOption){
				this.selectedBet[i].active = true;
			}else{
				this.selectedBet[i].active = false;
			}
		}
	},
	selectBetOption(event, value){
		this.selectedBetOption = Number(value);
		//cc.log("Selected bet option:" + this.selectedBetOption);

		for(let i = 0; i < this.selectedBet.length; i++){
			if(i == this.selectedBetOption){
				this.selectedBet[i].active = true;
				this.bet_options[i].scale= cc.v2(1.2,1.2);
			}else{
				this.selectedBet[i].active = false;
				this.bet_options[i].scale= cc.v2(1,1);

			}
		}

		if (!(this.playBtn==null)) {

			this.playBtn.interactable = true;
			this.playBtn.node.opacity = 255;
		}
		globalData.setBetSelection(this.selectedBetOption);
	},
	
    StartGame(){
		//send server
		//start game
		
	},

	arrayContainValue(array, value){
		for(let i = 0; i < array.length; i++){
			if(array[i] == value){
				return true;
			}
		}
		return false;
	},

	clearArray(array){
		while(array.length > 0){
			array.pop();
		}
	},

	getRandomInt(min, max){
		return parseInt(Math.random() * (max + 1 - min) + min);
	}
});
