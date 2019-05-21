import HttpUtil from "../net/HttpUtil";
import {getTexttoAudio, initPushUrl} from "../net/HttpURLConstant";
import SignUtils from "./SignUtils";
import {closePush, initPush} from "../net/WebSocketUtil";
import {PUSH_TAG} from "../constant/Constant";
import Sound from "react-native-sound";

let uid;
let mObject;
let webSocket;
//初始化语音推送，通过接口拿到后台返回长连接地址
export const initAudioPush =(object,callBack)=>{
    if(webSocket && object.uid === uid){
        return;
    }
    uid = object.uid;
    mObject = object;
    let params = {'appTag':'mms','uid':object.uid};
    params.sign = SignUtils.getSign(params);
    HttpUtil.getInstance().get(initPushUrl,params)
        .then(result=>{
            if(result.status === 200000){
                let wsUrl = result.data['ws'];
                let token = result.data['token'];
                let obj = {command: 'authToken',data:{extTag: '',message: {token : token}}};
                obj = JSON.stringify(obj);
                webSocket = initPush(wsUrl,obj,(audioTxt,orderSN)=>{
                    callBack(audioTxt);
                    audioPlay(audioTxt,orderSN);
                });
            }
        })
        .catch(error=>{
        })
};

export const closeAudioPush = () =>{
    closePush();
};

//通过接口将语音文本转换成MP3文件并进行播放
function audioPlay(audioTxt,orderSN){
    let obj ={"orderSn":orderSN,"text":audioTxt,"mType":"mms"};
    HttpUtil.getInstance().post(getTexttoAudio,obj,mObject.token)
        .then(result=>{
            if(result){
                let audioUrl = result.data['audioUrl'];
                const s = new Sound(audioUrl,null,(e) =>{
                    if(!e){
                        s.play(() => s.release());
                    }else{
                    }
                });
            }
        })
        .catch(error=>{
        })
}