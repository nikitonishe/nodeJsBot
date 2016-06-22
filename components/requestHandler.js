'use strict';

var requestHandler = function(request, chatId, bot){
    try{
    	var index = require('../avito/'+request.what+'/index');
        index(request, chatId, bot);
    }catch(e){
    	throw e;
        //bot.sendMessage(chatId,'Что то не так =(. Я не умею искать такие объявления.');
    }
}

module.exports = requestHandler;