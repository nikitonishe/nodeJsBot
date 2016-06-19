'use strict';

var request = require('request'),
    TelegramBot = require('node-telegram-bot-api'),
    async = require('async'),
    Promise = require('promise');

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

var parsePage = function(parsedData,chatId, bot){
    async.each(parsedData, function(ad, callback){
        var url = 'https://www.avito.ru' + ad.link;
        request(url, function(err, res, body){
            if(err)console.error(err);
            if (body){
                var parsedPage = pageParser(body);
                ad.photoLink = parsedPage.photoLink
                ad.location = {};
                ad.location.lat = parsedPage.location.lat;
                ad.location.lon = parsedPage.location.lon;
                callback();
            }
        })
    },function(err){
        if(err){
            console.log(err);
        }else{
            view(chatId, parsedData, bot)();
        }
    });
};
/*
var parsePage = function(parsedData,chatId, bot){
    async.each(parsedData, function(ad, callback){
        var url = 'https://www.avito.ru' + ad.link;
        var pageRequest = requestPromiseDecorator(url);
        pageRequest.then(function(err,req,body){
            var parsedPage = pageParser(body);
            console.log(parsedPage);
            return parsedPage;
        }).catch(function(err){
            console.log(err);
        });
    },function(err){
        if(err){
            console.log(err);
        }else{
            view(chatId, parsedData, bot)();
        }
    });
};
*/

var requestPromiseDecorator = function(url){
    var promise = new Promise(function(resolve,reject){
        request(url, function(err,req,body){
            resolve(body);
        });
    })
    return promise;
};

var avito = function(userRequest, maxQuantityOfMessages, chatId, bot){

    if(!requireModulesAndSetUrl(userRequest, chatId, bot)){
        return;
    }

    var firstRequest = requestPromiseDecorator(url)

    firstRequest.then(function(body){
        var parsedData = parser(body, maxQuantityOfMessages);
        if(parsedData && parsedData[0]){ 
            parsePage(parsedData, chatId, bot);
        }else{
            bot.sendMessage(chatId, 'Ничего не найдено =(');
        }
        return;
    }).catch(function(err) {
        console.log(err);
    })
};

module.exports = avito;