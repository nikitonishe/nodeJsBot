'use strict';

var requestHandler = function(request, maxQuantityOfMessages, chatId, bot){

    try{
    	var index = require('../avito/'+request.what+'/index');
        index(request, maxQuantityOfMessages, chatId, bot);

    }catch(e){

        console.log(e);
        
    }

}


module.exports = requestHandler;