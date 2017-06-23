var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ModelSchema   = new Schema({
    user_id: String,
    state_id: String,
    expiration_time: Date,
});

module.exports = mongoose.model('Model', ModelSchema);
