'use strict';

var wrappers = require('./wrappers'),
    Db = require('../../db/db').Db,
    config =  require('../../config'),
    compareDate = require('../utilits/compareDate'),
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

var avito = function(userRequest, chatId, bot, isAutoUpdate){
    if(!requireModulesAndSetVar(userRequest, chatId, bot)){
        return;
    }
    var parseMainPage = wrappers.parseMainPageWrapper(chatId, bot, parser, maxQuantity),
        parsePages = wrappers.parsePagesWrapper(chatId, bot, view, pageParser, isAutoUpdate);

    var db = new Db(config.dburl);

    wrappers.requestPromiseWrapper(url)
        .then(parseMainPage)
        .then((parsedData) => {

            parsedData.sort(compareDate);
            parsedData.reverse();

            return db.getLastDatePromise(chatId)
                .then(lastDate => {
                    if(!isAutoUpdate || !lastDate){
                        var maxIndex = parsedData.length > maxQuantity ? maxQuantity : parsedData.length;
                        parsedData.splice(maxIndex);
                        parsedData.reverse();
                        return parsedData; 
                    }
                    for(var i = 0; i < parsedData.length; i++ ){
                        if(parsedData[i] && compareDate(parsedData[i], {date: lastDate}) !== 1){
                            parsedData.splice(i,parsedData.length);
                            break;
                        }
                    }
                    parsedData.reverse();
                    return parsedData;
                })

        }).then(parsedData => {

            if(!parsedData || !parsedData[0]){
                return new Promise((resole,reject)=>reject(null));
            }
            if(!isAutoUpdate){
                db.connection.close();
                return parsedData;
            }
            return db.setLastDatePromise(chatId, parsedData[parsedData.length - 1].date)
                .then(() => {
                    db.connection.close();
                    return parsedData;
                });

        }).then(parsePages)
        .catch(function(err, parsedData) {
            if(err) console.log(err);
            db.connection.close();
        })
};

module.exports = avito;