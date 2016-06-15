'use strict';

var cheerio = require('cheerio'),
    math = require('math');

var parser = function(body, maxQuantityOfMessages){

    var parsedData = [],
        $ = cheerio.load(body);

    var divs = $('.item_table');

    var maxIndex = math.min(divs.length,maxQuantityOfMessages);

    for(var i = 0; i < maxIndex; i++){

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

        if(!link || !title || !address){
            console.log(1);
            continue;
        }

        price = $('#'+id+' div.about');
        price = $(price).text().trim().replace(/\s+/g,' ').replace(/комиссия\s\d+\s%|без\sкомиссии/,'');

        middleman = $('#'+id+' .data p');
        middleman = $(middleman).text().trim().replace(/\s+/g,'');
        middleman = middleman ? middleman : 'Без посредников';

        date = $('#'+id+' .data .clearfix .date');
        date = $(date).text().trim().replace(/\s+/g,' ');

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

    return parsedData;

};

module.exports = parser;