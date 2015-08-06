var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playerSchema = new Schema ({
	playerName: { type: String, required: true },
	playerTeamID: { type: Number, required: true }
});

var Player = mongoose.model('players', playerSchema);

module.exports = Player;
