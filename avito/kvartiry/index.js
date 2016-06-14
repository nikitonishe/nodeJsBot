'use strict';

var request = require('request'),
    TelegramBot = require('node-telegram-bot-api');

var avito = function(userRequest, maxQuantityOfMessages, chatId, bot){
    
    try{

        var parser = require('./parsers/' + userRequest.parametrs[0] + '/parser'),
            pageParser = require('./parsers/' + userRequest.parametrs[0] + '/pageParser'),
            view = require('./views/' + userRequest.parametrs[0]),
            url = 'https://www.avito.ru/' + userRequest.where+'/' 
                  +userRequest.what + '/' + userRequest.parametrs[0];

    }catch(e){

        console.log(e);
    
    }

    request(url, function(err, res, body){

        if(err)console.error(err);
        else if(body){

            var parsedData = parser(body, maxQuantityOfMessages);

            if(parsedData && parsedData[0]){ 

                var sendMessages = view(chatId, parsedData, bot);
                sendMessages();

            }else{

                bot.sendMessage(chatId, 'Ничего не найдено =(');

            }

        }

    });
    
};

module.exports = avito;