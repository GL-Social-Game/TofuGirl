import * as global from "GlobalData";
import * as constant from "Constant";
import * as ecrypt from "Encrypt";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
		// ...
		
		betScene:{
			default:null,
			type:cc.Node,
		},
		
		errorLabel:{
			default:null,
			type:cc.Label,
		},

		errorLayer:{
			default:null,
			type:cc.Node,
		}
    },

    // use this for initialization
    onLoad: function () {
    },

    start(){
        // this.connectAPI();
    },

    getSettings(){
		global.host_id = this.getParameterByName('host_id');
		global.access_token = this.getParameterByName('access_token');

		let xhr = new XMLHttpRequest();
		var self = this;
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4 &&(xhr.status >= 200 && xhr.status < 400)) {
				var response = xhr.responseText;
				var parsed = JSON.parse(response);

				global.settings = parsed.data;
				// global.setSettings(parsed.data);
				//console.log(global.settings);

				// global.isPlayerBalanceUpdated = true;
				//console.log("get balance from server: " + global.settings.balance);
				//cc.log(global.settings.balance);
				//global.balance = global.settings.balance;
				// if(global.settings!=null){
				// 	self.betScene.getComponent("startGame").updateCreditLabel();
				// }
				
				
				if(global.settings==undefined){
					self.errorLayer.active = true;
					self.errorLabel.string = parsed.error.message;
				}
				else{
					global.isPlayerBalanceUpdated = true;
					self.betScene.getComponent("StartScene").updateCreditLabel();
				}

				// console.log(global.getSettings());
			}
			else{
				//console.log("xhr.readyState = "+ xhr.readyState);
				//console.log("xhr.status = "+ xhr.status);
			}
		};

		var body = {
			"host_id": this.getParameterByName('host_id'), 
    		"access_token": this.getParameterByName('access_token'),
    		"device_type": "Desktop",
    		"game_code": 24,
    		"country_code": "MY"
		}

		var json = JSON.stringify(body);
		let url = "https://bo-stage.slot28.com/api/user/get-settings?host_id="+global.host_id+"&access_token="+global.access_token+"&game_code=24";

		// let url = "https://bo-stage-apl.velachip.com/api/user/get-settings?host_id=0e83088027d4c42c8e9934388480c996&access_token=demo01&game_code=21";
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.setRequestHeader("Accept-Language", "en-US");
		xhr.send(json);
	},
	
	getParameterByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';

			return decodeURIComponent(results[2].replace(/\+/g, " "));
	},
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
