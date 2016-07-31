var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


// User schema 
var UserSchema   = new Schema({
	email:   {type:String},
	name:    {type:String},
	number:  {type:Number},
	admin:   {type:Boolean},
	meals:   {type:Boolean},
	library: {type:Boolean},
});

module.exports = mongoose.model('User', UserSchema);