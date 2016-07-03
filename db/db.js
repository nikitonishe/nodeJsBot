'use strict';

var mongoose = require('mongoose'),
    models = require('./models');

mongoose.Promise = global.Promise;

var Db = function(dburl){
    this.connection = mongoose.createConnection(dburl);
    this.userAccessor = this.connection.model('User',models.userSchema);



    this.setUser = (chatId, searchRequest, callback) => {
        var user = new this.userAccessor(new models.User (chatId, searchRequest));
        user.save(callback);
    };

    this.setUserPromise = (chatId,searchRequest)=>{
        return new Promise((resolve,reject)=>{
            this.setUser(chatId, searchRequest, (err,user)=>{
                if(err) reject(err);
                resolve(user);
            });
        });
    };



    this.removeUser = (chatId, callback) => {
        this.userAccessor.findOne({_id:chatId}).remove(callback);
    };

    this.removeUserPromise = (chatId)=>{
        return new Promise((resolve,reject)=>{
            this.userAccessor.findOne({_id:chatId}).remove((err)=>{
                if(err) reject(err);
                resolve(true);
            });
        });
    };



    this.getUser = (chatId,callback) => {
        this.userAccessor.findOne({_id:chatId}, callback);
    };

    this.getUserRequestPromise = (chatId)=>{
        return new Promise((resolve,reject)=>{
            this.getUser(chatId, (err,user)=>{
                if(err) reject(err);
                resolve(user.get('searchRequest'));
            });
        });
    };

    this.getLastDatePromise = (chatId)=>{
        return new Promise((resolve,reject)=>{
            this.getUser(chatId, (err,user)=>{
                if(err) reject(err);
                if(user) resolve(user.get('lastDate'));
                resolve(false);
            });
        });
    };



    this.setLastDate = (chatId, lastDate, callback) => {
        this.userAccessor.update({_id: chatId}, {lastDate: lastDate}, callback);
    }

    this.setLastDatePromise = (chatId, lastDate) => {
        return new Promise((resolve, reject) => {
            this.setLastDate(chatId, lastDate, (err, result)=>{
                if(err) reject(err);
                resolve(result);
            });
        });
    };

};

module.exports.Db = Db;