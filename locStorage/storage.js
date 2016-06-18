'use strict';

if (typeof localStorage === "undefined" || localStorage === null){
    var LocalStorage = require('node-localstorage').LocalStorage;
    var localStorage = new LocalStorage('./locStorage/items');
}

localStorage.__proto__.init = function(chatId){
    return localStorage.setItem(chatId, '1');
};

if(localStorage){
    module.exports = localStorage;
}