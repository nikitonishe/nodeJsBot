var dataToMessages = function(data, maxQuantityOfMessages){

    var messages = [],
        message = "",
        maxQuantity = maxQuantityOfMessages || data.length;
    
    for(i = 0; i < maxQuantity;i++){

        ad = data[i];
        message = ad.appartment;

        if(ad.appartmentArea !== 'неизвестно'|| ad.floor !=='неизвестно'){
            message += ' (' + (ad.appartmentArea !== 'неизвестно' ? ad.appartmentArea:"")
                    + ' ' +(ad.floor !== 'неизвестно' ? ad.floor:"") +')';
        }

        message += '\nАдрес: '+ ad.address
                + '\nЦена: ' + ad.price
                + '\nПосредники: ' + (ad.agent ? ad.agent:"Без посредников")
                + '\n\n Дата размещения объявления: ' + ad.date;
        
        messages.push(message);
    }

    return messages.reverse();

};

module.exports = dataToMessages;