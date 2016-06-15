'use strict';

var requestHandler = function(request, maxQuantityOfMessages, chatId, bot){
    try{
    	var index = require('../avito/'+request.what+'/index');
        index(request, maxQuantityOfMessages, chatId, bot);
    }catch(e){
        bot.sendMessage(chatId,'Что то не так =(. Я не умею искать такие объявления.');
    }
}


module.exports = requestHandler;