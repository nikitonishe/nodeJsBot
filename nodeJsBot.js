'use strict';

var TelegramBot = require('node-telegram-bot-api'),
    storage = require('./locStorage/storage'),
    adaptUserRequest = require('./components/userRequestAdaptor'),
    requestHandler = require('./components/requestHandler'),
    db = require('./db/db'),
    async = require('async'),
    config = require('./config');

var token = config.token,
    options = {polling: true};

var bot = new TelegramBot(token,options);

bot.on('text', function(message){
    var chatId = message.chat.id,
        textMes = message.text,
        storageItem;


    if(textMes === '/cancel'){
        storage.removeItem(chatId);
        bot.sendMessage(chatId, 'Поиск отменен. Чтобы начать поиск, напишите /search.');
        return;
    }

    if(!(storageItem = storage.getItem(chatId))){
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
        return;
    }

    if(storageItem.match(/[а-яa-zё_]+\/[а-яa-zё]+\/[а-яa-zё]+\/[0-9]/i)){
        if((+textMes) === 0){
            bot.sendMessage(chatId, 'Введите число больше нуля =)');
            return;
        }
        if(textMes.match(/нет/)){
            var adaptedRequest = adaptUserRequest(storageItem);
            requestHandler(adaptedRequest, chatId, bot);
            storage.removeItem(chatId);
            return;
        }
        if(!textMes.match(/[0-9]+/)){
            bot.sendMessage(chatId, 'Напишите число или "нет".');
            return;
        }
        var adaptedRequest = adaptUserRequest(storageItem);
        requestHandler(adaptedRequest, chatId, bot);
        storage.removeItem(chatId);

        var removeUser = db.removeUserWrapper(chatId),
            setConnection = db.setConnectionWrapper(config.dburl),
            setUser = db.setUserWrapper(chatId, storageItem.replace(/\/[0-9]+/, ''), textMes[0]),
            getUserRequest = db.getUserRequestWrapper(chatId);

        async.waterfall([
            setConnection,
            removeUser,
            setUser
            ],function(err, result){
                if(err) console.log(err);
                db.mongoose.connection.close();
            });

        return;
    }

    if(storageItem.match(/[а-яa-zё_]+\/[а-яa-zё]+\/[а-яa-zё]+\//i)){
        if(!(textMes = textMes.match(/\b[0-9]+\b/))){
            bot.sendMessage(chatId, 'Введите число');
            return;
        }
        if((+textMes[0]) === 0){
            bot.sendMessage(chatId, 'Введите число больше нуля =)');
            return;
        }
        storage.setItem(chatId, storageItem+textMes[0]);
        bot.sendMessage(chatId, 'Хотите, чтобы я автоматически присылал новые объявления?'+ 
                                '( Если да, напишите интервал в минутах. Если нет, напишите "нет".)');
        return;
    }

    if(!(textMes = textMes.match(/[а-яa-zё\s_]+/i))){
        bot.sendMessage(chatId, 'Какой-то странный город =(. Попробуйте еще раз.(напишите город)');
        return;
    }
    textMes = (textMes[0].replace(/\s/g,'_')).toLowerCase();
    storage.setItem(chatId, textMes + '/квартиры/сдам/');
    bot.sendMessage(chatId, 'Напишите максимальное количество объявлений.');
    return;
});