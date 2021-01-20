import * as ecryptContoller from 'ecrypt_New';

var global = require("GlobalData");

cc.Class({
    extends: cc.Component,

    onLoad: function()
    {        
        if(window.endPointConfig != null){
            var networkConfig = ecryptContoller.decrypt(window.endPointConfig);
            if(networkConfig != null){
                var networkConfigJson = JSON.parse(networkConfig);

                //cc.log(networkConfigJson.geoip_url);
                // cc.log(networkConfigJson.api_url);

                global.geoIP_URL = networkConfigJson.geoip_url;

                global.api_Url = networkConfigJson.api_url;
                
                // cc.log(global.SetGeoip_Url(networkConfigJson.geoip_url));
                // cc.log(global.SetApi_Url(networkConfigJson.api_url));
            }
            else{
                global.geoIP_URL = "https://bo-stage.slot28.com";
                global.api_Url ="//geoip.slot28.com/api/";
            }
        }
        this.api = this.node.getComponent("API");
        this.api.getSettings();
    },
});
