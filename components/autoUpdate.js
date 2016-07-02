var async = require('async'),
	Math = require('math'),
	config= require('../config'),
	requestHandler = require('./requestHandler'),
	db = require('../db/db');

var AutoUpdate= function () {
	var timeouts = [];
	var instance;

	var update = function(bot){
		var currentTimeout = 5;
		var nextTimeout

		var setConnection = db.setConnectionWrapper(config.dburl);

		return function rec(){
			var currentTimeouts = [];
			var minTimeout = 100000000;
			nextTimeout = null;
			var dif;

			for(var i = 0, l = timeouts.length; i < l; i++){
				if(timeouts[i] && timeouts[i].timeout <= currentTimeout && currentTimeout%timeouts[i].timeout === 0){
					currentTimeouts.push(timeouts[i]);
				}
				if(timeouts[i] && timeouts[i].timeout < minTimeout && timeouts[i].timeout > currentTimeout){
					nextTimeout = timeouts[i].timeout;
					minTimeout = timeouts[i].timeout;
				}
			}
			if(nextTimeout === null){
				currentTimeout = 5;
				dif = 5
			}else{
				dif = nextTimeout-currentTimeout;
				currentTimeout = nextTimeout;
			}

			currentTimeouts.forEach(function(item, i, arr){
				var getUserRequest = db.getUserRequestWrapper(item.chatId);
				async.waterfall([
					setConnection,
					getUserRequest,
					],function(err,result){
						db.mongoose.connection.close();
						if(err) console.log(err);
						requestHandler(result, item.chatId, bot, true);
					});
			});

			setTimeout(rec, dif*1000*60/5);
		}
	};


	var AutoUpdate = function(chatId, timeout) {
		if(!instance){
			instance = this;
		} else{
			return instance;
		} 
	}
	
	AutoUpdate.prototype.addInterval = function(chatId, timeout){
		timeouts.push({
				chatId: chatId,
				timeout: timeout
		});
	}

	AutoUpdate.prototype.startAutoUpdate = function(bot){
		if(timeouts.length !== 1){
			return;
		}
		setTimeout(function(){
				update(bot)();
			},5000*60/5);
	}

	AutoUpdate.prototype.removeInterval = function(chatId){
		for(var i = 0, l = timeouts.length; i < l; i++){
			if(timeouts[i] && timeouts[i].chatId === chatId){
				delete timeouts[i]
				break;
			}
		};
	}

	return AutoUpdate;
}();

module.exports = AutoUpdate;
