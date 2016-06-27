var async = require('async'),
    request = require('request'),
    db = require('../../../db/db');

var requestPromiseWrapper = function(url){
    return new Promise(function(resolve,reject){
        request(url, function(err,req,body){
            resolve(body);
        });
    });
};

var parseMainPageWrapper = function(chatId, bot, parser, maxQuantity, isAutoUpdate){ 
    return function(body){
        var parsedData = parser(body, maxQuantity, isAutoUpdate);
        if(parsedData && parsedData[0]){ 
            return parsedData;
        }
        bot.sendMessage(chatId, 'Ничего не найдено =(.Чтобы отменить автообновление напишите /cancel.'+
                                ' Чтобы начать поиск напишите /search.');
        return false;
    };
};

var parsePagesWrapper = function(chatId, bot, view, pageParser){
    return function(parsedData){
        if(!parsedData && !parsedData[0]){
            return;
        }
        async.each(parsedData, function(ad, callView){
            var setAdditionalInfo = function(body){
                var parsedPage = pageParser(body);
                ad.photoLink = parsedPage.photoLink
                ad.location = {};
                ad.location.lat = parsedPage.location.lat;
                ad.location.lon = parsedPage.location.lon;
                callView();
                return parsedData;
            }
            var url = 'https://www.avito.ru' + ad.link;
            var pageRequest = requestPromiseWrapper(url);
            pageRequest
                .then(setAdditionalInfo)
                .catch(function(err){
                    console.log(err);
                });
        },function(err){
            if(err) console.log(err);
            else view(parsedData, chatId, bot)();
            return false;
        });
    }
};


module.exports.requestPromiseWrapper = requestPromiseWrapper;
module.exports.parseMainPageWrapper = parseMainPageWrapper;
module.exports.parsePagesWrapper = parsePagesWrapper;
