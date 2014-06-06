var mongoose = require('mongoose'),
    Types = mongoose.Schema.Types;

var userSchema = new (mongoose.Schema)({

});

module.exports = mongoose.model('User', userSchema);
