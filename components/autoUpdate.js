'use strict';

var config= require('../config'),
	requestHandler = require('./requestHandler'),
	Db = require('../db/db').Db;

var AutoUpdate= function () {
	var timeouts = [];
	var instance;

	var update = function(bot){
		var currentTimeout = 5;
		var nextTimeout

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
				var db = new Db(config.dburl);
				db.getUserRequestPromise(item.chatId)
					.then((userRequest)=>{
						db.connection.close();
						requestHandler(userRequest, item.chatId, bot, true);
					})
					.catch((err)=>{
						if(err)consol.log(err);
						db.connection.close();
					})
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
