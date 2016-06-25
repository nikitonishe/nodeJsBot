var mongoose = require('mongoose');

var schema = mongoose.Schema({
  _id: Number,
  searchRequest: String,
});

var User = mongoose.model('User',schema);

module.exports.User = mongoose.model('User',schema);
module.exports.mongoose = mongoose;