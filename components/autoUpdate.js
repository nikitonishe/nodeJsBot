var config= require('../config'),
	async = require('async');

var AutoUpdate = function () {
	var instance;

	return function Construct_singletone () {
		this.interval = [];
		if (instance) {
			return instance;
		}
		if (this && this.constructor === Construct_singletone) {
			instance = this;
		} else {
			return new Construct_singletone();
		}
	}
}();

var AutoUpdate = function(){
	var instance = this
	this.interval = [];
}

AutoUpdate.prototype.addInterval = function(chatId, interval){
	this.intervals[chatId] = interval;
};

AutoUpdate.prototype.removeInterval = function(chatId){
	delete intervals[chatId];
}


AutoUpdate.prototype.setAutoUpdates = function(db){

	var setConnection = db.setConnectionWrapper(config.dburl);

	intervals.forEach(function(item,i,arr){
		var getUserRequest = db.getUserRequestWrapper(i);
		async.waterfall([
			setConnection,
			getUserRequest,
			db.mongoose.connection.close()
			],function(err, result){
				if(err) console.log(err);
				console.log(result)
			})
	});
};

module.exports = AutoUpdate;

