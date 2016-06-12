var requestHandler = function(request, maxQuantityOfMessages, chatId, bot){

    try{
    	var index = require('../avito/'+request.what+'/index');
    	if(index){

            index(request, maxQuantityOfMessages, chatId, bot);
           
    	}else{

    		console.log('Не подключилось =(');

    	}

    }catch(e){
        console.log(e);
    	console.log('try Такое мы искать не умеем =(');

    }

}


module.exports = requestHandler;