var User = require('./models').User,
    mongoose = require('./models').mongoose;

var setUser = function(id, searchRequest, interval){
    var user = new User({
        _id: id,
        searchRequest: searchRequest,
        interval: interval
    });

    user.save(function(err,user,affected){
        if(err) throw err;
        mongoose.connection.close();
        console.log(true)
    });
};

var getSearchRequest = function(id){
    User.findOne({_id: id}, function(err, user){
        if(err) throw err;
        mongoose.connection.close();
        console.log(user.getSearchRequest());
    });
};

var removeUser = function(id){
    User.findOne({_id: id}).remove(function(err, removed){
        if(err) throw err;
        mongoose.connection.close();
        console.log(true);
    });
};