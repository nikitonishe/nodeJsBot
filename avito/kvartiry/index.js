'use strict';

var wrappers = require('./wrappers'),
    parser,pageParser,view,url,maxQuantity;

var requireModulesAndSetVar = function(userRequest, chatId, bot){
    try{
        parser = require('./parsers/' + userRequest.parametrs[0] + '/parser');
        pageParser = require('./parsers/' + userRequest.parametrs[0] + '/pageParser');
        view = require('./views/' + userRequest.parametrs[0]);
        url = 'https://www.avito.ru/' + userRequest.where+'/' 
                +userRequest.what + '/' + userRequest.parametrs[0],
        maxQuantity = userRequest.parametrs[1] ? userRequest.parametrs[1] : 100;
        return true;
    }catch(e){
        throw(e);
        //bot.sendMessage(chatId, 'Что то не так =(. Скорее всего я не умею искать объявления типа ' + userRequest.parametrs[0]);
    }
};

var avito = function(userRequest, chatId, bot){
    if(!requireModulesAndSetVar(userRequest, chatId, bot)){
        return;
    }
    var firstRequest = wrappers.requestPromiseWrapper(url),
        parseMainPage = wrappers.parseMainPageWrapper(chatId, bot, parser, maxQuantity),
        parsePages = wrappers.parsePagesWrapper(chatId, bot, view, pageParser);

    firstRequest
        .then(parseMainPage)
        .then(parsePages)
        .catch(function(err) {
            console.log(err);
        })
};


module.exports = avito;