var mongoose = require('mongoose'),
    Types = mongoose.Schema.Types;

var sessionSchema = new (mongoose.Schema)({

});

module.exports = mongoose.model('Session', sessionSchema);
