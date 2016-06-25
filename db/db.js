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

module.exports.setConnectionWrapper = setConnectionWrapper;
module.exports.removeUserWrapper = removeUserWrapper;
module.exports.setUserWrapper = setUserWrapper;
module.exports.getUserRequestWrapper = getUserRequestWrapper;
module.exports.mongoose = mongoose;