'use strict';

var translate = function(){
	var rus = ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й',
	           'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф',
	           'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я'],

	    eng = ['a', 'b', 'v', 'g', 'd', 'e', 'e', 'zh', 'z', 'i', 'y',
	           'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'f',
	           'h', 'ts', 'ch', 'sh', 'sch', '', 'y', '', 'e', 'yu', 'ya'];

	return function(ru){

		if(ru && typeof(ru) === 'string'){

	        for(var i = 0; i<rus.length; i++){
	            ru = (ru.split(rus[i])).join(eng[i]);
	        }
	        return ru;

        }else{
        	console.log('Тескт не был передан');
        }

	};
};

var Request = function(where,what,parametrs){
	this.where = where;
	this.what = what;
	this.parametrs = parametrs;    
};


var adaptUserRequest = function(userRequest){
    userRequest = userRequest.split('/');

    var where = userRequest.shift(),
        what = userRequest.shift(),
        parametrs = userRequest;

    where = translate()(where);
    what = translate()(what);

    for(var i = 0 ; i < parametrs.length; i++ ){
    	parametrs[i] = translate()(parametrs[i]);
    }

    var adaptedRequest = new Request(where,what,parametrs);
	return adaptedRequest;	
};

module.exports = adaptUserRequest;