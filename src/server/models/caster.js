var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var casterSchema = new Schema({
    casterName: String,
    casterAlias: { type: String, required: true },
    casterWebsite: String,
    casterCountry: String,
    casterImage: String
});

var Caster = mongoose.model('caster', casterSchema);

module.exports = Caster;
