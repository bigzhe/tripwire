var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MessageSchema   = new Schema({
    text: String,
    value: Number
});

module.exports = mongoose.model('Message', MessageSchema);
