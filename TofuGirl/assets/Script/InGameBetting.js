import * as globalData from "GlobalData";
import * as ecrypt from "ecrypt";

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

    setAmountText(){
		for(let i = 0; i < this.bettingOptionText.length; i++){
            let index = i;
            this.bettingOptionText[index].getComponent(cc.Label).string = globalData.betRangeConfig[this.maintBetOption] * globalData.betAmountConfig[index];
		}
	},
    SetAmount(value){
        // this.maintBetOption = this.mainBetSelection.getComponent("BetSelection").selectedBetOption;
        this.maintBetOption = globalData.getBetSelection();
        this.myValue = globalData.betRangeConfig[this.maintBetOption];
        this.setAmountText();
        
        if (value != 0 && this.selectedBetOption!=10) {
            this.currentBetting = globalData.betRangeConfig[this.maintBetOption] * globalData.betAmountConfig[globalData.getBetAmountIndex()];

            for (let i = 0; i < this.selectedBet.length; i++) {
                if (i == this.selectedBetOption) {
                    this.selectedBet[i].active = true;
                    this.myButton[i].scale = cc.v2(1.2, 1.2);

                } else {
                    this.selectedBet[i].active = false;
                    this.myButton[i].scale = cc.v2(1, 1);

                }
            }

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
        
        this.currentBetting = globalData.betRangeConfig[this.maintBetOption] * globalData.betAmountConfig[globalData.getBetAmountIndex()];

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
                "is_apollo_v3": globalData.is_apollo_v3,
            };
            if(globalData.isEncrypt){
                emit_result = ecrypt.encrypt(JSON.stringify(emit_result));
            }
            globalData.getSocket().emit('bet', emit_result);
        }
        else {
            globalData.settings.balance -= this.currentBetting;
        }
    }
    
    // update (dt) {},
});