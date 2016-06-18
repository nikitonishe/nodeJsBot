'use strict';

var request = require('request'),
    TelegramBot = require('node-telegram-bot-api');

var parser,pageParser,view,url;

var requireModulesAndSetUrl = function(userRequest, chatId, bot){
    try{
        parser = require('./parsers/' + userRequest.parametrs[0] + '/parser');
        pageParser = require('./parsers/' + userRequest.parametrs[0] + '/pageParser');
        view = require('./views/' + userRequest.parametrs[0]);
        url = 'https://www.avito.ru/' + userRequest.where+'/' 
                +userRequest.what + '/' + userRequest.parametrs[0];
        return true;
    }catch(e){
        throw(e);
        //bot.sendMessage(chatId, 'Что то не так =(. Скорее всего я не умею искать объявления типа ' + userRequest.parametrs[0]);
    }
};

var parsePage = function(parsedData, chatId, bot){
    var counter = 0;
    return function req(){
        var url = 'https://www.avito.ru' + parsedData[counter].link;
        request(url, function(err, res, body){
            if(err)console.error(err);
            else if (body){
                var parsedPage = pageParser(body);
                parsedData[counter].photoLink = parsedPage.photoLink
                parsedData[counter].location = {};
                parsedData[counter].location.lat = parsedPage.location.lat;
                parsedData[counter].location.lon = parsedPage.location.lon;
                counter ++;
                if(counter === parsedData.length){
                    var sendMessages = view(chatId, parsedData, bot);
                    sendMessages();
                }else{
                    req();
                }
            }
        });
    }
};

var avito = function(userRequest, maxQuantityOfMessages, chatId, bot){
    if(requireModulesAndSetUrl(userRequest, chatId, bot)){
        request(url, function(err, res, body){
            if(err)console.error(err);
            else if(body){
                var parsedData = parser(body, maxQuantityOfMessages);
                if(parsedData && parsedData[0]){ 
                    var req = parsePage(parsedData, chatId, bot);
                    req();
                }else{
                    bot.sendMessage(chatId, 'Ничего не найдено =(');
                }
            }
        });
    }
};

module.exports = avito;