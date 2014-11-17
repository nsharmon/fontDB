var mongoose = require('mongoose');

var FontSchema = new mongoose.Schema({
  name: String,
  isTrueType: {type: Boolean, default: false},
  state: {type: String, default: 'pending'}
});

mongoose.model('Font', FontSchema);