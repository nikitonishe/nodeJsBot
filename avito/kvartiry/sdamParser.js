var Ad = function(appartment, area, floor, price, adress,agent, date){
    this.appartment = appartment;
    this.appartmentArea = area;
    this.floor = floor;
    this.price = price;
    this.address = adress;
    this.agent = agent;
    this.date = date;
    return this;
};

var elementParser = function(element){

    var appartment = element.match( /[0-9]-к\sквартира/i );

    var appartmentArea = element.match( /[0-9]+.[0-9]+\sм/i )
        || element.match( /[0-9]+\sм/i )
        || ['неизвестно'];

    var floor = element.match(/[0-9]+\/[0-9]+\sэт./i) || ['неизвестно'];

    var price = element.match( /[0-9]+\s[0-9]+\sруб.\sза\sсутки/i )
        || element.match( /[0-9]+\s[0-9]+\sруб.\sв\sмесяц/i)
        || element.match( /[0-9]+\sруб.\sза\sсутки/i )
        || ['неизвестно'];

    var date = element.match(/Сегодня\s[0-9]+:[0-9]+/i)
        || element.match(/Вчера\s[0-9]+:[0-9]+/i)
        || element.match(/[0-9]+\s[а-яА-Я]+\s[0-9]+:[0-9]+/i)
        || ['неизвестно'];

    var agent = element.match(/Агентство/i)
        || [null];

    if(price[0]!=='неизвестно' && date[0] !== "неизвестно" || agent[0]){
        var address = element.slice((element.indexOf(price[0])+price[0].length),
            agent[0]? element.indexOf(agent) : element.indexOf(date[0])).trim();
    }

    if(appartment && address){
        ad = new Ad(appartment[0],appartmentArea[0],floor[0],price[0],address, agent[0], date[0]);
        return ad;
    }

    return undefined;
};

var parser = function(text){

    var parsedAds = [],
        parsedElement,
        maxIndex;

    text = text.replace(/[^а-яА-Я0-9/\-.:, ]/g, "")
        .replace(/комиссия\s[0-9][0-9]/g, "")
        .replace(/без комиссии/g, "")
        .replace(/\s+/g, " ")
        .split(" В избранное ");
    
    maxIndex = text.length;

    for(var i = 0; i < maxIndex; i++){
        parsedElement = elementParser(text[i]);
        if (parsedElement !== undefined) {
            parsedAds.push(parsedElement);
        }
    }

    return parsedAds;
};

module.exports = parser;