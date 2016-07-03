var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  _id: Number,
  searchRequest: String,
  lastDate: String,
});

var User = function(chatId, searchRequest){
	this._id = chatId;
	this.searchRequest = searchRequest;
	this.lastDate = '';
}

module.exports.userSchema = userSchema;
module.exports.User = User;
module.exports.mongoose = mongoose;