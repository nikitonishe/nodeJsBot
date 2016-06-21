'use strict';

var sendMessagesWithTimeout = function(parsedData, chatId, bot){
    var counter = -1,
        maxIndex = parsedData.length;

    return function send(){
        counter++;

        var message = parsedData[counter].title;

        message += parsedData[counter].price ? ('\n' + parsedData[counter].price) : '';
        message += '\n'+parsedData[counter].address +'\nпосредник: ' + parsedData[counter].middleman;
        message += parsedData[counter].commission ? ('\nкомиссия: ' + parsedData[counter].commission) : '';
        message += parsedData[counter].date ? ('\nдата размещения объявления: ' + parsedData[counter].date) : '';
        message += parsedData[counter].photoLink ? ('\n' + parsedData[counter].photoLink) : '';
        bot.sendMessage(chatId, message);

        if(parsedData[counter].location.lat && parsedData[counter].location.lon){
            setTimeout(function(){
                bot.sendLocation(chatId, parsedData[counter].location.lat, parsedData[counter].location.lon);
            },1000);
        }

        if(counter < (maxIndex - 1)){
            setTimeout(send,2500);
        }else{
            setTimeout(function(){
                bot.sendMessage(chatId, 'Чтобы начать поиск, напишите /search.');
            },2500);
        }
    }
};

module.exports = sendMessagesWithTimeout;