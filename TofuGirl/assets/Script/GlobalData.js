var balance = 10000;
var betSelection =0;
var sound = 1;
var effect_volume = 0.2;
var rotate_volume = 1;
var betAmountIndex = 0;
var multiplier = 0;
export var MaxWinMultiplier = 10000;
var socket = null;
export var isDemo = false;
export var isProduction = false;
export var currentValueSound = -1;
export var finishGetData= false;
export var finishGeneratingBalance=false;
export function getSocket(){
    return socket;
}
    //dsg-005, game code - 24.

export function setSocket(value){
    //cc.log("Setting socket");
    socket = value;
    return (socket);
}

export var maxPayOut = 0;
export var settings = {
    balance : 9999999999999999,
    currency : "MYR",
    exit_btn : 0,
    game_on : 0,
    game_type : "dsg-005",
    guest_mode : 0,
    hyperdrive: "",
    is_demo: 0,
    is_jackpot: 0,
    isroundednumber: 0,
    jackpot: 0,
    lobby_url: "",
    socket_url: "https://socket-apollo.velachip.com",
    status: "",
    user_id: "",
    username: ""
}
export var isfullScreen =0;
export var game_code = 24;
export var ticket_id = -1;

export var errorMessage = "";
export var isEncrypt = true;

export var host_id=0;
export var access_token = 0;
export var winMultiplier = [25,25,25,22.72727273,22.22222222];
export function getMultiplier(){
    return multiplier;
}

export function setMultiplier(value){
    multiplier = value;
    return (multiplier);
}
export function getBetAmountIndex(){
    return betAmountIndex;
}
export function setBetAmountIndex(value){
    betAmountIndex = value;
    return (betAmountIndex);
}
export function getBetSelection(){
    return betSelection;
}

export function setBetSelection(value){
    betSelection = value;
    return (betSelection);
}

export function getBalance(){
    return balance;
}

export function setBalance(value){
    balance = value;
    return (balance);
}

export function getSound(){
    return sound;
}

export function setSound(value){
    sound = value;
    return (sound);
}

export function setEffectVolume(value){
    effect_volume = value;
    return (effect_volume);
}

export function getEffectVolume(){
    return effect_volume;
}


export function setRotateVolume(value){
    rotate_volume = value;
    return (rotate_volume);
}

export function getRotateVolume(){
    return rotate_volume;
}


export var api_Url;
export var geoIP_Url;