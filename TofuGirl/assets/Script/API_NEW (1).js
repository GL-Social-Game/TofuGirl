import * as ecryptContoller from 'ecrypt_New';

var global = require("GlobalData");

cc.Class({
    extends: cc.Component,

    onLoad: function()
    {        

        // window.endPointConfig = "4c96bb1efbf574786f42da8c5d105937JUMyJTkwJUMzJUFCJUMyJUIyJUMzJUIxJUMzJUEwJUMzJUI5JUMzJThGJUMzJUE1JUMzJUEyJUMzJUJDJUMyJUIyJUMyJUFBJUMyJUIyJUMzJUI4JUMzJUE0JUMzJUE0JUMzJUEwJUMzJUEzJUMyJUFBJUMyJUJGJUMyJUJGJUMzJUIyJUMzJUJGJUMyJUJFJUMzJUEzJUMzJUJDJUMzJUJGJUMzJUE0JUMyJUEyJUMyJUE4JUMyJUJFJUMzJUIzJUMzJUJGJUMzJUJEJUMyJUIyJUMyJUJDJUMyJUIyJUMzJUI3JUMzJUI1JUMzJUJGJUMzJUI5JUMzJUEwJUMzJThGJUMzJUE1JUMzJUEyJUMzJUJDJUMyJUIyJUMyJUFBJUMyJUIyJUMzJUI4JUMzJUE0JUMzJUE0JUMzJUEwJUMzJUEzJUMyJUFBJUMyJUJGJUMyJUJGJUMzJUI3JUMzJUI1JUMzJUJGJUMzJUI5JUMzJUEwJUMyJUJFJUMzJUEzJUMzJUJDJUMzJUJGJUMzJUE0JUMyJUEyJUMyJUE4JUMyJUJFJUMzJUIzJUMzJUJGJUMzJUJEJUMyJUJGJUMzJUIxJUMzJUEwJUMzJUI5JUMyJUJGJUMyJUIyJUMyJUJDJUMyJUIyJUMzJUIxJUMzJUEzJUMzJUEzJUMzJUI1JUMzJUE0JUMzJThGJUMzJUIyJUMzJUE1JUMzJUJFJUMzJUI0JUMzJUJDJUMzJUI1JUMzJThGJUMzJUE1JUMzJUEyJUMzJUJDJUMyJUIyJUMyJUFBJUMyJUIyJUMzJUI4JUMzJUE0JUMzJUE0JUMzJUEwJUMzJUEzJUMyJUFBJUMyJUJGJUMyJUJGJUMzJUIxJUMzJUEzJUMzJUEzJUMzJUI1JUMzJUE0JUMyJUJEJUMzJUIyJUMzJUE1JUMzJUJFJUMzJUI0JUMzJUJDJUMzJUI1JUMyJUJFJUMzJUEzJUMzJUJDJUMzJUJGJUMzJUE0JUMyJUEyJUMyJUE4JUMyJUJFJUMzJUIzJUMzJUJGJUMzJUJEJUMyJUJGJUMzJUEwJUMzJUEyJUMzJUJGJUMzJUI0JUMzJUE1JUMzJUIzJUMzJUE0JUMzJUI5JUMzJUJGJUMzJUJFJUMyJUJGJUMyJUIyJUMzJUFE";
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
        }
        this.api = this.node.getComponent("API");
        this.api.getSettings();
    },
});
