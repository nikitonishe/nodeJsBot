var mongoose = require('mongoose');

var schema = mongoose.Schema({
  _id: Number,
  searchRequest: String,
  interval: Number
});

schema.methods.getSearchRequest = function(){
  return this.get('searchRequest');
};

var User = mongoose.model('User',schema);

exports.User = mongoose.model('User',schema);
exports.mongoose = mongoose;