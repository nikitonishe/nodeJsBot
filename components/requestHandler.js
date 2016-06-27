'use strict';

var adaptUserRequest = require('./userRequestAdaptor');

var requestHandler = function(request, chatId, bot, isAutoUpdate){
    try{
    	var adaptedRequest = adaptUserRequest(request);
    	var index = require('../avito/'+adaptedRequest.what+'/index');
        index(adaptedRequest, chatId, bot, isAutoUpdate);
    }catch(e){
    	throw e;
        //bot.sendMessage(chatId,'Что то не так =(. Я не умею искать такие объявления.');
    }
}

module.exports = requestHandler;