var User = require('./models').User,
    mongoose = require('./models').mongoose;


var removeUserWrapper = function(chatId){
    return new Promise(function(resolve,reject){
        mongoose.connect('mongodb://127.0.0.1:27017/nodeJsBot');
        User.findOne({_id: chatId}).remove(function(err, removed){
            if(err) reject(err);
            mongoose.connection.close();
            console.log('removeUser');
            resolve(true);
        });
    });
};

var setUserWrapper = function(chatId, searchRequest, interval){
    return function(user){
        var user = new User({
            _id: chatId,
            searchRequest: searchRequest,
            interval: interval
        });
        console.log('set');
        return new Promise(function(resolve,reject){
            console.log('setUs');




            user.save(function(err,user,affected){
                if(err) reject(err);
                mongoose.connection.close();
                console.log('setUser');
                resolve(true);
            });



        });
    }
}

var getSearchRequest = function(id,cb){
    User.findOne({_id: id}, function(err, user){
        if(err) throw err;
        mongoose.connection.close();
        console.log(user.getSearchRequest());
        cb()
    });
};



module.exports.removeUserWrapper = removeUserWrapper;
module.exports.setUserWrapper = setUserWrapper;