var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


// Meal schema 
var SportsSchema   = new Schema({
  place:          {type:String},
  playersPerTeam: {type: Number},
  numberOfTeams:  {type: Number},
  startTime:      {type: Date},
  endTime:        {type:Date},
  isLocked:       {type:Boolean},
  playersList:    [{team: Number, player: String}]
});

module.exports = mongoose.model('Sport', SportsSchema);