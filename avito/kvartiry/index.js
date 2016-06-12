var request = require('request'),
    cheerio = require('cheerio'),
    sleep = require('sleep');


var sendMessagesWithTimeout = function(chatId, messages, quantity, bot){

    var counter = 0,
        quantity = quantity,
        chatId = chatId,
        messages = messages,
        bot = bot;

    return function send(){

        bot.sendMessage(chatId, messages[counter]);
        counter++

        if(counter < quantity){

            setTimeout(send,1000);

        }else{

            setTimeout(function(){
                bot.sendMessage(chatId, 'Чтобы начать поиск, напишите /search.');
            },1000);

            return;
        }
    }
};


var avito = function(userRequest, maxQuantityOfMessages, chatId, bot){
    
    switch(userRequest.parametrs[0]){
        case ('снять'):

            var parser = require('./sdamParser');
            var view = require('./views/sdam')
            var url = 'https://www.avito.ru/' + userRequest.where+'/' 
                      +userRequest.what + '/sdam';
            break;

        default:

            console.log('Такое искать не умею =(');  

    }
    
    request(url, function(err, res, body){

        if(err)console.error(err);
        else if(body){

            var $= cheerio.load(body);
            var text = $('.catalog-list').text();
            var parsedData = parser(text);

            if(parsedData && parsedData[0]){
                
            

                var messages = view(parsedData,maxQuantityOfMessages),
                    maxIndex = messages.length;

                var sendMessages = sendMessagesWithTimeout(chatId, messages, maxIndex, bot);
                sendMessages();

            }else{

                bot.sendMessage(chatId, 'Объявлений не найдено =(. Чтобы начать поиск, напишите /search.');

            }

        }

    });
    

};

module.exports = avito;