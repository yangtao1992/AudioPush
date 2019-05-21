import {PUSH_TAG} from "../constant/Constant";

let isConnect = false;
let isReconnect = true;
let ws,obj,wsUrl,mCallBack;
export const initPush = (url,params,callBack) =>{
    if(url){
        wsUrl = url;
        obj = params;
        mCallBack = callBack;
        closeConnect();
        return init();
    }
};

export const closePush = () =>{
    closeConnect();
};

function closeConnect() {
    if(ws){
        isReconnect = false;
        ws.close();
    }
}

function init(){
    ws = new WebSocket(wsUrl);
    // 打开连接
    ws.onopen = () => {
        checkHeart.reset().start();
        //发送连接验证token
        ws.send(obj);
    };

    // 接收消息
    ws.onmessage = (evt) => {
        checkHeart.reset().start();
        msgHandle(evt);
    };

    //发生错误
    ws.onerror = (evt) => {
    };

    //连接被关闭
    ws.onclose = (evt) => {
        if(isReconnect){
            reconnect();
        }else{
            isReconnect = true;
        }
    };
    return ws;
}

function reconnect() {
    if(!isConnect){
        isConnect = true;
        setTimeout(function(){
            init();
            isConnect = false;
        }, 2000);
    }
}

var checkHeart = {
    timeoutObj: null,
    reset:function(){
        clearTimeout(this.timeoutObj);
        return this;
    },
    start:function(){
        this.timeoutObj = setTimeout(function(){
            ws.close();
        },40000)
    }
};

//消息处理
function msgHandle(evt){
    let obj = JSON.parse(evt.data);
    if(obj){
        //heartbeat代表心跳，message代表消息，broadcast代表广播
        if(obj['command'] === 'heartbeat'){
            obj['data']['message']['msgBody'] = (new Date()).getTime() + '';
            ws.send(JSON.stringify(obj));
        }else if(obj['command'] === 'message'){
            // let dateTime = obj['data']['message']['dateTime']
            // let message = JSON.parse(obj['data']['message']['msgBody']).content;
            let audioTxt = JSON.parse(obj['data']['message']['msgBody']).audioTxt;
            let orderSN = JSON.parse(obj['data']['message']['msgBody']).orderSN;
            if(audioTxt && mCallBack){
                mCallBack(audioTxt,orderSN);
            }
        }
    }
}

