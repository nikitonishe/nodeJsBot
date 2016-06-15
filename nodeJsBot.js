'use strict';

var TelegramBot = require('node-telegram-bot-api'),
    storage = require('./locStorage/storage'),
    adaptUserRequest = require('./components/userRequestAdaptor'),
    requestHandler = require('./components/requestHandler');

var token = 'token',
    options = {polling: true};

var bot = new TelegramBot(token,options);





bot.on('text', function(message){

    var chatId = message.chat.id,
        textMes = message.text,
        storageItem;

    if(storageItem = storage.getItem(chatId)){

        if(textMes === '/cancel'){

            storage.removeItem(chatId);
            bot.sendMessage(chatId, 'Поиск отменен. Чтобы начать поиск, напишите /search.');

        }else{

            if(storageItem.match(/[а-яa-zё_]+\//i)){

                if (textMes = textMes.match(/\b[0-9]+\b/)){

                    var adaptedRequest = adaptUserRequest(storageItem);
                    requestHandler(adaptedRequest, textMes[0] ,chatId, bot);
                    storage.removeItem(chatId);

                } else {

                    bot.sendMessage(chatId, 'Введите число');

                }

            }else if(storageItem === "1"){

                if (textMes = textMes.match(/[а-яa-zё\s_]+/i)){

                    textMes = (textMes[0].replace(/\s/g,'_')).toLowerCase();
                    storage.setItem(chatId, textMes + '/');
                    bot.sendMessage(chatId, 'Напишите максимальное количество объявлений.');

                } else {

                    bot.sendMessage(chatId, 'Какой-то странный город =(. Попробуйте еще раз.(напишите город)');

                }

            }else{

                bot.sendMessage(chatId, 'Что то не так');

            }

        }

    }else{

        switch (textMes) {
            case ('/start'):
            case('/help'):
                bot.sendMessage(chatId, 'Я могу искать объявления на авито о сдаче квартир.\n'+
                                        '/start - начальное меню.\n/search - начать поиск.'+
                                        '\n/help - помощь по поиску.\n/cancel - отменить текущий поиск.');
                break;
            case('/search'):
                storage.init(chatId);
                bot.sendMessage(chatId, 'Где искать?(напишите город или область и город.'+
                                        'Например, "Курск" или "Курская область Железногорск".)');
                break;
            default:
                bot.sendMessage(chatId, 'Чтобы начать поиск, напишите /search.');
        }

    }

});