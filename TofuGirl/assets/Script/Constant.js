// var socketURL = "192.168.100.6:8099";
// var socketURL = "slot-grabber.casinoville.net"
// var socketURL = "https://st-socket-dsocial.slot28.com/bet";
// export var gameSocketURL = "https://st-socket-dsocial.slot28.com/game";
// var socketURL = "https://st-socket-dsocial.slot28.com";
var socketURL = "localhost:9000";
// export var gameSocketURL = "localhost:7777/game";
// var socketURL = "192.168.100.45:8098";
// var apiURL = "http://bo.fun1881.com/api/user/";
var apiURL = "http://bo-stage.velachip.com/api/mini-game/";
var loginURL = "http://bo-stage.velachip.com/api/user/login";
var prizeListURL = "http://bo-stage.velachip.com/api/berchinko/list";
var redeemPrizeURL = "http://bo-stage.velachip.com/api/user/redeem";
var gameHistroyURL = "http://bo-stage.velachip.com/api/berchinko/history";
var redeemHistroyURL = "http://bo-stage.velachip.com/api/berchinko/transaction";
var signUpURL = "http://bo-stage.velachip.com/api/user/register";
var lobbyAPI = "http://bo-stage.velachip.com/api/user/get-info";
var forgetPassURL = "http://bo-stage.velachip.com/api/user/forgot-password";
var gameCode = "76";

var game_version = "1.1.0";

export function getForgetPassURL(){
    return forgetPassURL;
}

export function getSignUpURL(){
    return signUpURL;
}

export function getLobbyAPI(){
    return lobbyAPI;
}

export function getRedeemHistoryURL(){
    return redeemHistroyURL;
}

export function getGameHistoryURL(){
    return gameHistroyURL;
}

export function getRedeemURL(){
    return redeemPrizeURL;
}

export function getPrizeListURL(){
    return prizeListURL;
}

export function getLoginURL(){
    return loginURL;
}

export function setGameCode(value){
    gameCode = value;
    return (gameCode);
}

export function setSocketURL(value){
    socketURL = value;
    return (socketURL);
}

export function setApiURL(value){
    apiURL = value;
    return (apiURL);
}

export function getGameVersion(){
    return game_version;
}

export function getSocketURL(){
    return socketURL;
}

export function getApiURL(){
    return apiURL;
}

export function getGameCode(){
    return gameCode;
}