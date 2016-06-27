'use strict';

var cheerio = require('cheerio'),
    compareDate = require('./utilits/compareDate');

var parser = function(body, maxQuantityOfMessages, isAutoUpdate){
    var parsedData = [],
        $ = cheerio.load(body);
    var divs = $('.item_table');

    for(var i = 0; i < divs.length; i++){
        var link,
            title,
            price,
            address,
            middleman,
            date,
            commission;

        var div = divs[i];
        var id = $(div).attr('id');

        link = $('#'+id+' h3.title a');
        link = $(link).attr('href').trim().replace(/\s+/g,' ');

        title = $('#'+id+' h3.title');
        title = $(title).text().trim().replace(/\s+/g,' ');

        address = $('#'+id+' p.address');
        address = $(address).text().trim().replace(/\s+/g,' ');

        date = $('#'+id+' .data .clearfix .date');
        date = $(date).text().trim().replace(/\s+/g,' ');

        if(!link || !title || !address || !date){
            continue;
        }

        price = $('#'+id+' div.about');
        price = $(price).text().trim().replace(/\s+/g,' ').replace(/комиссия\s\d+\s%|без\sкомиссии/,'');

        middleman = $('#'+id+' .data p');
        middleman = $(middleman).text().trim().replace(/\s+/g,'');
        middleman = middleman ? middleman : 'Без посредников';

        commission = $('#'+id+' .about span');
        commission = $(commission).text().trim().replace(/\s+/g,' ');

        parsedData.push({
            link: link,
            title: title,
            price: price,
            address: address,
            middleman: middleman,
            date: date,
            commission: commission
        });
    }

    var maxIndex = divs.length > maxQuantityOfMessages ? maxQuantityOfMessages : divs.length;

    parsedData.sort(compareDate);
    if(!isAutoUpdate){
        parsedData.reverse();
        parsedData.splice(maxIndex);
        parsedData.reverse();
        return parsedData;
    }
    var lastDate;
    // взять lastDate из бд
    if(!lastDate){
        parsedData.reverse();
        parsedData.splice(maxIndex);
        parsedData.reverse();
        return parsedData;
    }
    if(isAutoUpdate){
       
        for(var i = 0, l = parsedData.length; i < l; i++ ){
            //отсеять обаявления старше lastDate
        }

        lastDate = parsedData[parsedData.length-1]? parsedData[parsedData.length-1].date : null;
        if(lastDate){
            //занести lastDate в бд
        }
    }
    return parsedData;
};


module.exports = parser;