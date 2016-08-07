var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


// User schema 
var UserSchema   = new Schema({
	email:   {type:String},
	number:  {type:Number},
	admin:   {type:Boolean},
	meals:   {type:Boolean},
	library: {type:Boolean},
	hasDiet: {type:Boolean},
	dietContent: {type:String},

});

module.exports = mongoose.model('User', UserSchema);