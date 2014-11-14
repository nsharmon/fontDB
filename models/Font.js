var mongoose = require('mongoose');

var FontSchema = new mongoose.Schema({
  name: String,
  isTrueType: {type: Boolean, default: false}
});

mongoose.model('Font', FontSchema);