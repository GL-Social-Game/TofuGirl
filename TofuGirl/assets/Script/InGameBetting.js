import * as globalData from "GlobalData";
cc.Class({
    extends: cc.Component,

    properties: {
    
        winPayRate:{
            default:[],
            type:[cc.Integer]
        },

        myButton:{
            default:[],
            type:[cc.Node],
        },
     
       
        mainGame:{
            default:null,
            type:cc.Node
        },

      
        bettingOptionText:{
            default:[],
            type:[cc.Node]
        },
        
        playButton:{
            default:null,
            type:cc.Button,
        },
        selectedBet:{
            default:[],
			type:[cc.Node]
        },

    
        currentBettingLabel:{
            default:null,
            type:cc.Label,
        },
        canPlay:false,
        hiding:false,
        currentBetting:0,
        moneyPerScoreLabel:{
            default:null,
            type:cc.Label,
        },
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        //this.winPayRate = [40,38,36,34,32]
        this.selectedBetOption = 10;
        this.SetAmount(0);
         this.mainGame = this.mainGame.getComponent("StartScene");
     },

    
    SetAmount(value){
        // this.maintBetOption = this.mainBetSelection.getComponent("BetSelection").selectedBetOption;
        this.maintBetOption = globalData.getBetSelection();
        if(this.maintBetOption==0){
            this.myValue = 1;
        }
        if(this.maintBetOption==1){
            this.myValue = 5;

        }
        if(this.maintBetOption==2){
            this.myValue = 10;
        }
        if(this.maintBetOption==3){
            this.myValue = 20;
        }
        for(let i = 0; i < this.bettingOptionText.length; i++){
            if(i==0){
                this.bettingOptionText[i].getComponent(cc.Label).string = ((1*this.myValue));
            }
            else if(i==1){
                this.bettingOptionText[i].getComponent(cc.Label).string = ((1*this.myValue))*2;
            }
            else if(i==2){
                this.bettingOptionText[i].getComponent(cc.Label).string = ((1*this.myValue))*3;
            }
            else{
                this.bettingOptionText[i].getComponent(cc.Label).string = ((1*this.myValue)/(this.bettingOptionText.length-i))*10;
            }
		}   

        if (value != 0 && this.selectedBetOption!=10) {
            if (this.selectedBetOption < 3) {
                this.currentBetting = ((1 * this.myValue)) * (this.selectedBetOption + 1);
            }
            else {
                this.currentBetting = ((1 * this.myValue) / (this.bettingOptionText.length - this.selectedBetOption)) * 10;
            }


            for (let i = 0; i < this.selectedBet.length; i++) {
                if (i == this.selectedBetOption) {
                    this.selectedBet[i].active = true;
                    this.myButton[i].scale = cc.v2(1.2, 1.2);

                } else {
                    this.selectedBet[i].active = false;
                    this.myButton[i].scale = cc.v2(1, 1);

                }
            }

            // this.currentBettingLabel.string = this.currentBetting;
            // this.moneyPerScoreLabel.string = "1 Score = " + Math.round(((this.currentBetting / globalData.winMultiplier[this.selectedBetOption])*100/100) * 1000) / 1000;
            globalData.setMultiplier(Math.round(this.currentBetting / globalData.winMultiplier[this.selectedBetOption] * 10000) / 10000);
            if (globalData.settings.balance >= this.currentBetting && globalData.getSocket() != null) {
                this.playButton.interactable = true;
                this.mainGame.closeInsufficient();

            }
            else {
                this.playButton.interactable = false;
                this.mainGame.openInsufficient();

            }
        }
        else{
            this.moneyPerScoreLabel.string = "";
            this.playButton.interactable = false;
        }
    },

    
	selectBetOption(event, value){
		this.selectedBetOption = Number(value);
        this.canPlay = true;
        globalData.setBetAmountIndex(value);
       // this.node.active = false;
		//cc.log("Selected bet option:" + this.selectedBetOption);
        for(let i = 0; i < this.selectedBet.length; i++){
			if(i == value){
                this.selectedBet[i].active =true;
                this.myButton[i].scale = cc.v2(1.2,1.2);
        
			}else{
                this.selectedBet[i].active =false;
                this.myButton[i].scale = cc.v2(1,1);

			}
        }
        
        if(this.selectedBetOption<3){
            this.currentBetting=((1*this.myValue))*(this.selectedBetOption+1);
        }
        else{
            this.currentBetting=((1*this.myValue)/(this.bettingOptionText.length-this.selectedBetOption))*10;
        }

        
       // this.currentBettingLabel.string = this.currentBetting;
    //    this.moneyPerScoreLabel.string = "1 Score = " + Math.round(((this.currentBetting / globalData.winMultiplier[this.selectedBetOption])*100/100) * 1000) / 1000;
       globalData.setMultiplier(Math.round(this.currentBetting/globalData.winMultiplier[this.selectedBetOption]*10000)/10000);

        if (globalData.settings.balance >= this.currentBetting && globalData.getSocket() != null) {
            this.playButton.interactable = true;
            this.mainGame.closeInsufficient();

        }
        else {
            this.playButton.interactable = false;
            this.mainGame.openInsufficient();
        }

	},
    
    checkSufficientMoney(){
        if(globalData.settings.balance>= this.currentBetting){
            return true;
        }

        return false;
    },
    pay(){
    //    globalData.setBalance(globalData.getBalance()-this.currentBetting);
        if (!globalData.isDemo) {
            var emit_result = {
                'host_id': globalData.host_id,
                'access_token': globalData.access_token,
                'game_code': globalData.game_code,
                'betAmount': this.currentBetting,
                "key": "TofuGirl bet with these index 1st",
                "description": "bet",
                "user_id": globalData.settings.user_id,
                "scorePerOne": globalData.getMultiplier(),
                'api_url':globalData.api_Url,
                "currentBetSlot" :globalData.getBetAmountIndex(),

            };
            if(globalData.isEncrypt){
                emit_result = btoa(JSON.stringify(emit_result));
            }
            globalData.getSocket().emit('bet', emit_result);
        }
        else {
            globalData.settings.balance -= this.currentBetting;
        }
    }
    
    // update (dt) {},
});