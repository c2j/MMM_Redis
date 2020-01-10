var redis = require("redis");
var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({

    config: {},

	updateTimer: null,
	updateProcessStarted: false,

	start: function () {
        var self = this;
        console.log("Redis Help start...");
        var key = "face_message"; //this.config.channel;

        var redisSubClient = redis.createClient(6379, "localhost");
        
        // 客户端连接redis成功后执行回调
        redisSubClient.on("ready", () => {
            // 订阅消息
            redisSubClient.subscribe(key);
            console.log("订阅成功。。。");
        });

        redisSubClient.on("error", error => {
            console.log("Redis Error " + error);
        });
        // 监听订阅成功事件
        redisSubClient.on('subscribe', (channel, count)=>{
            console.log("client subscribed to " + channel + "," + count + "total subscriptions");
        });
        // 收到消息后执行回调
        redisSubClient.on('message', (channel, message)=>{
            console.log(`收到 ${channel} 频道的消息： ${message}`);
            //self.sendSocketNotification("STATUS", message);
            self.sendNotification("STATUS", message);
        });
        // 监听取消订阅事件
        redisSubClient.on("unsubscribe", (channel, count) => {
            console.log("client unsubscribed from" + channel + ", " + count + " total subscriptions")
        });
	},

	
    
	socketNotificationReceived: function(notification, payload) {
        var self = this;
        console.log("Redis Help socketNotificationReceived...");
        Log.info("Redis Help socketNotificationReceived...");
        console.info(notification+" helper "+payload);
		if (notification === "CONFIG") {
            this.config = payload;
            
		} 
	}

	

});