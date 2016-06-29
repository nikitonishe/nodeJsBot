var User = require('./models').User,
    mongoose = require('./models').mongoose;

var setConnectionWrapper = function(dburl){
    return function(callback){
        mongoose.connect(dburl);
        callback(null, true);
    };
};



var removeUserWrapper = function(chatId){
    return function(connection, callback){
        if(!connection) callback(new Error('db connect error'));
        User.findOne({_id: chatId}).remove(function(err, removed){
            if(err) callback(err);
            callback(null,removed);
            });
    };
};

var setUserWrapper = function(chatId, searchRequest){
    var user = new User({
        _id: chatId,
        searchRequest: searchRequest,
        lastDate: ''
    });

    return function(affected, callback){
        user.save(function(err,user,affected){
            if(err) callback(err);
            callback(null, affected);
        });
    };
};


var getUserRequestWrapper = function(chatId){
    return function(affected, callback){
        User.findOne({_id: chatId}, function(err, user){
            if(err) callback(err);
            callback(null, user.get('searchRequest'));
        });
    };
};

var getLastDatePromiseWrapper = (chatId)=>{
    return new Promise((resolve, reject)=>{
        User.findOne({_id: chatId}, (err, user) => {
            if(err) reject(err);
            resolve(user.get('lastDate'));
        });
    });
};

var setLastDatePromiseWrapper = (chatId, newLastDate)=>{
    return new Promise((resolve, reject)=>{
        User.update({_id: chatId}, {lastDate: newLastDate}, function(err, user){
            if(err) reject(err);
            resolve(true);
        });
    });
};


module.exports.setConnectionWrapper = setConnectionWrapper;
module.exports.removeUserWrapper = removeUserWrapper;
module.exports.setUserWrapper = setUserWrapper;
module.exports.getUserRequestWrapper = getUserRequestWrapper;
module.exports.getLastDatePromiseWrapper = getLastDatePromiseWrapper;
module.exports.setLastDatePromiseWrapper = setLastDatePromiseWrapper;
module.exports.mongoose = mongoose;
module.exports.User = User