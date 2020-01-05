var redis = require("redis");
var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({

    config: {},

	updateTimer: null,
	updateProcessStarted: false,

	start: function () {
	},

	

	socketNotificationReceived: function (notification, payload) {
        var self = this;
        Log.info(notification+" "+payload);
		if (notification === "CONFIG") {
            this.config = payload;
            var key = this.config.channel;

			var redisSubClient = redis.createClient(6379, "localhost");
            
            // 客户端连接redis成功后执行回调
            redisSubClient.on("ready", () => {
                // 订阅消息
                redisSubClient.subscribe(key);
                Log.info("订阅成功。。。");
            });

            redisSubClient.on("error", error => {
                Log.info("Redis Error " + error);
            });
            // 监听订阅成功事件
            redisSubClient.on('subscribe', (channel, count)=>{
                Log.info("client subscribed to " + channel + "," + count + "total subscriptions");
            });
            // 收到消息后执行回调
            redisSubClient.on('message', (channel, message)=>{
                Log.info(`收到 ${channel} 频道的消息： ${message}`);
                self.sendSocketNotification("STATUS", message);
            });
            // 监听取消订阅事件
            redisSubClient.on("unsubscribe", (channel, count) => {
                Log.info("client unsubscribed from" + channel + ", " + count + " total subscriptions")
            });
		} 
	}

	

});