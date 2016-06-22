var mounthToNumber = function(mounth){
    switch(mounth){
        case('января'):
            return 0;
        case('февраля'):
            return 1;
        case('марта'):
            return 2;
        case('апреля'):
            return 3;
        case('мая'):
            return 4;
        case('июня'):
            return 5;
        case('июля'):
            return 6;
        case('августа'):
            return 7;
        case('сентября'):
            return 8;
        case('октября'):
            return 9;
        case('ноября'):
            return 10;
        case('декабря'):
            return 11;
    }
}

var compareTime = function(time1,time2){
    time1 = time1.split(':');
    time2 = time2.split(':');
    
    if(time1[0]>time2[0]){
        return 1;
    }
    if(time1[0]<time2[0]){
        return -1;
    }
    if(time1[1] <= time2[1]){
        return -1;
    }
    if(time1[1]>time2[1]){
        return 1;
    }
    
};

var compareDate = function(elem1,elem2){
    var date1 = elem1.date;
    var date2 = elem2.date;
    date1 = date1.split(' ');
    date2 = date2.split(' ');

    if(date1[0] === 'Сегодня' || date2[0] === 'Сегодня'){
        if(date2[0] !== 'Сегодня'){
            return 1;
        }else if(date1[0] !== 'Сегодня'){
            return -1;
        }else{
            return compareTime(date1[1],date2[1]);
        }
    }
    if(date1[0] === 'Вчера' || date2[0] === 'Вчера'){
        if(date2[0] !== 'Вчера'){
            return 1;
        }else if(date1[0] !== 'Вчера'){
            -1;
        }else{
            return compareTime(date1[1],date2[1]);
        }
    }

    date1[1] = mounthToNumber(date1[1]);
    date2[1] = mounthToNumber(date2[1]);
    if(date1[1] === date2[1]){
        if(date1[0] === date2[0]){
            return compareTime(date1[2],date2[2]);
        }else if(date1[0]>date2[0]){
            return 1;
        }else{
            return -1;
        }
    }else if(date1[1] > date2[1]){
        return 1;
    }else{
        return -1;
    }
    
};
module.exports = compareDate;
