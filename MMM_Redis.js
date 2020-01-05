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

		var client = redis.createClient(6379, "localhost");
	
		//sys.puts("waiting for messages...");
		client.on(
			"error",
			function(err){
				console.log("err"+err);
				}
		);
		client.subscribe("face_message");
		client.on('subscribe',
			function(channel,count){
				console.log("channel:" + channel + ", count:"+count);
				}
		);
		client.on('message',
			function(channel,message){
				console.log("channel:" + channel + ", msg:"+message);
				wrapper.innerHTML = message;
				}
		);
		client.on('unsubscribe',
			function(channel,count){
				console.log("channel:" + channel + ", count:"+count);
	
		/* ————————————————
		版权声明：本文为CSDN博主「cuipingxu51111」的原创文章，遵循 CC 4.0 BY-SA 版权协议，转载请附上原文出处链接及本声明。
		原文链接：https://blog.csdn.net/cuipingxu51111/article/details/40183925
		*/

		self.wrapper = wrapper;
	}

	// Override dom generator.
	getDom: function() {
		var self = this;
		var wrapper = self.wrapper;
		return wrapper;
	}
});
