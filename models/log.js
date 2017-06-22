var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var LogSchema   = new Schema({
    id: String,
    date: Date,
    pc: String,
    action: String
});

module.exports = mongoose.model('Log', LogSchema);
