'use strict';

var sendMessagesWithTimeout = function(parsedData, chatId, bot, isAutoUpdate){
    var counter = -1,
        maxIndex = parsedData.length;

    return function send(){
        counter++;
        var message = parsedData[counter].title;

        message += parsedData[counter].price ? ('\n' + parsedData[counter].price) : '';
        message += '\n'+parsedData[counter].address +'\nпосредник: ' + parsedData[counter].middleman;
        message += parsedData[counter].commission ? ('\nкомиссия: ' + parsedData[counter].commission) : '';
        message += parsedData[counter].date ? ('\nдата размещения объявления: ' + parsedData[counter].date) : '';
        message += '\nподробнее: avito.ru'+parsedData[counter].link;
        bot.sendMessage(chatId, message);

        if(parsedData[counter].photoLink){
            setTimeout(function(){
                bot.sendMessage(chatId, parsedData[counter].photoLink);
            },1000);   
        }

        if(parsedData[counter].location.lat && parsedData[counter].location.lon){
            setTimeout(function(){
                bot.sendLocation(chatId, parsedData[counter].location.lat, parsedData[counter].location.lon);
            },1500);
        }

        if(counter < (maxIndex-1)){
            setTimeout(send,4000);
        }else{
            setTimeout(function(){
                if(isAutoUpdate) {
                    bot.sendMessage(chatId, 'Чтобы остановить автообновление, напишите /cancel. Чтобы начать новый поиск, напишите /search.');
                    return;
                }
                bot.sendMessage(chatId, 'Чтобы начать поиск, напишите /search.');
            },2500);
        }
    }
};


module.exports = sendMessagesWithTimeout;