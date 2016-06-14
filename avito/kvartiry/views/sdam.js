'use strict';

var sendMessagesWithTimeout = function(chatId, parsedData, bot){

    var counter = 0,
        chatId = chatId,
        parsedData = parsedData,
        maxIndex = parsedData.length,
        bot = bot;


    return function send(){

        var message = parsedData[counter].title;

        message += parsedData[counter].price ? ('\n' + parsedData[counter].price) : '';
        message += '\n'+parsedData[counter].address +'\nпосредник: ' + parsedData[counter].middleman;
        message += parsedData[counter].commission ? ('\nкомиссия: ' + parsedData[counter].commission) : '';
        message += parsedData[counter].date ? ('\nдата размещения объявления: ' + parsedData[counter].date) : '';

        bot.sendMessage(chatId, message);
        counter++;

        if(counter < maxIndex){

            setTimeout(send,1000);

        }else{

            setTimeout(function(){
                bot.sendMessage(chatId, 'Чтобы начать поиск, напишите /search.');
            },1000);

        }
    }
};

module.exports = sendMessagesWithTimeout;