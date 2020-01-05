/* global Module */

/* Magic Mirror
 * Module: HelloWorld
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

Module.register("MMM_Redis",{

	// Default module config.
	defaults: {
		text: "Hello World!"
	},

	// Define required scripts.
	getScripts: function() {
		return ["redis.js"];
	},

	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);

		// Schedule update interval.
		var self = this;

		var wrapper = document.createElement("div");
		wrapper.innerHTML = this.config.text;

		var redisSubClient = redis.createClient(6379, "localhost");
	
		var key = 'face_message';
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
			wrapper.innerHTML = message;
		});
		// 监听取消订阅事件
		redisSubClient.on("unsubscribe", (channel, count) => {
			console.log("client unsubscribed from" + channel + ", " + count + " total subscriptions")
		});


		self.wrapper = wrapper;
	}

	// Override dom generator.
	getDom: function() {
		var self = this;
		var wrapper = self.wrapper;
		return wrapper;
	}
});
