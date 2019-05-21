
	
	仿支付宝实时语音到账提醒功能，用户只需把相关js类拷到工程里面做些相应的参数修改便可。
	
	入口调用：
	可以在js父类里面编写如下代码：
	
    startAudioPush(uid){
        initAudioPush(object,(msg)=>{
            this.msgPush();
        });
    }
	
	//接收到推送后在子类所需要做的操作
    msgPush(){
    }
	
	//里面做了判断操作，无需担心担心多次startAudioPush时会创建多条长连接的问题
	
	