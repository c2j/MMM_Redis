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
		text: "Hello World!",
		updateInterval: 10 * 60 * 1000, // every 10 minutes
		refreshInterval: 24 * 60 * 60 * 1000, // one day
		channel: "face_message",
	},

	suspended: false,

	// Define required scripts.
	//getScripts: function() {
	//	return ["redis.js"];
	//},

	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);

		// Schedule update interval.
		var self = this;
		
		//setInterval( () => { self.updateDom(2); } , self.config.refreshInterval);
		//this.sendSocketNotification("CONFIG", this.config);
		Log.info("Started module: " + this.name);
	},

	notificationReceived: function (notification, payload, sender) {
		var self = this;
		Log.info("notificationReceived "+notification+" "+payload);
		if (notification === "DOM_OBJECTS_CREATED") {
			Log.info("Notify DOM_OBJECTS_CREATED")
			self.sendSocketNotification("CONFIG", this.config);
			
		}
	},

	socketNotificationReceived: function (notification, payload) {
		Log.info("socketNotificationReceived "+notification);
		if (notification === "STATUS") {
			this.updateUI(payload);
		}
	},

	updateUI: function (payload) {
		var self = this;
		self.text = payload;
		self.updateDom(2);
		
	},

	// Override dom generator.
	getDom: function () {
		var self = this;
		var wrapper = document.createElement("div");
		if(this.suspended==false){
			wrapper.innerHTML = self.text;
		}
		return wrapper;
	},

	suspend: function() {
		this.suspended=true;
	},
	resume: function() {
		this.suspended=false;
		this.updateDom(2);
	}
});
