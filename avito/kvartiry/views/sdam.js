'use strict';

var sendMessagesWithTimeout = function(chatId, parsedData, bot){
    var counter = -1,
        chatId = chatId,
        parsedData = parsedData,
        maxIndex = parsedData.length,
        bot = bot;

    return function send(){
        counter++;

        var message = parsedData[counter].title;

        message += parsedData[counter].price ? ('\n' + parsedData[counter].price) : '';
        message += '\n'+parsedData[counter].address +'\nпосредник: ' + parsedData[counter].middleman;
        message += parsedData[counter].commission ? ('\nкомиссия: ' + parsedData[counter].commission) : '';
        message += parsedData[counter].date ? ('\nдата размещения объявления: ' + parsedData[counter].date) : '';

        bot.sendMessage(chatId, message);
        if(parsedData[counter].location.lat && parsedData[counter].location.lon){
            setTimeout(function(){
                bot.sendLocation(chatId, parsedData[counter].location.lat, parsedData[counter].location.lon);
            },400);
        }

        if(counter < (maxIndex - 1)){
            setTimeout(send,1000);
        }else{
            setTimeout(function(){
                bot.sendMessage(chatId, 'Чтобы начать поиск, напишите /search.');
            },1000);
        }
    }
};

module.exports = sendMessagesWithTimeout;