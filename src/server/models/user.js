var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: { type: String, required: true, unique: true },
	userPassword: { type: String, required: true },
	isAdmin: Boolean,
	userPerferences: String
});

var User = mongoose.model('users', userSchema);

module.exports = User;
