var mongoose = require('mongoose');

var schema = mongoose.Schema({
  _id: Number,
  searchRequest: String,
  interval: Number
});

var User = mongoose.model('User',schema);

module.exports.User = mongoose.model('User',schema);
module.exports.mongoose = mongoose;