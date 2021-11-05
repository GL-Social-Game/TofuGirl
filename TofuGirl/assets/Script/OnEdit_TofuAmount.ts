
const {ccclass, property} = cc._decorator;

@ccclass
export default class OnEdit_TofuAmount extends cc.Component {
    onLoad(){
        this.node.on("text-changed", (editBox)=>{
            let number = parseInt(editBox.string);
            if(number < 10){
                number = 10;
                editBox.string = number.toString();
            }
        });
    }
}
