'use strict';

var TelegramBot = require('node-telegram-bot-api'),
    async = require('async'),
    requestHandler = require('./components/requestHandler'),
    db = require('./db/db'),
    config = require('./config'),
    AutoUpdate = require('./components/autoUpdate'),
    LocalStorage = require('node-localstorage').LocalStorage;

var token = config.token,
    options = {polling: true};

var bot = new TelegramBot(token,options),
    storage = new LocalStorage('./locStorage/items');

bot.on('text', function(message){
    var chatId = message.chat.id,
        textMes = message.text,
        storageItem;


    if(textMes === '/cancel'){
        storage.removeItem(chatId);

        var autoUpdate = new AutoUpdate();

        autoUpdate.removeInterval(chatId);

        var removeUser = db.removeUserWrapper(chatId),
            setConnection = db.setConnectionWrapper(config.dburl);


        async.waterfall([
            setConnection,
            removeUser
            ],function(err,result){
                db.mongoose.connection.close();
                if(err) console.log(err);
            })
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
                storage.setItem(chatId, 1);
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
            requestHandler(storageItem, chatId, bot, false);
            storage.removeItem(chatId);
            return;
        }
        if(!(textMes = textMes.match(/[0-9]+/))){
            bot.sendMessage(chatId, 'Напишите число или "нет".');
            return;
        }
        if(textMes[0] % 5 !== 0 || textMes[0] > 1440){
            bot.sendMessage(chatId, 'Некорректный интеравал. Попробуйте еще раз. Доступные интервалы: 5, 10, 15 ... 1440.');
            return;
        }
        requestHandler(storageItem, chatId, bot, true);
        storage.removeItem(chatId);

        var removeUser = db.removeUserWrapper(chatId),
            setConnection = db.setConnectionWrapper(config.dburl),
            setUser = db.setUserWrapper(chatId, storageItem.replace(/\/[0-9]+/, ''));

        async.waterfall([
            setConnection,
            removeUser,
            setUser
            ],function(err, result){
                if(err) console.log(err);
                db.mongoose.connection.close();
            });
        var autoUpdate = new AutoUpdate();
        autoUpdate.addInterval(chatId, textMes[0]);
        autoUpdate.startAutoUpdate(bot);
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
                                '( Если да, напишите интервал в минутах 5, 10, 15 ... 1440. Если нет, напишите "нет".)');
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