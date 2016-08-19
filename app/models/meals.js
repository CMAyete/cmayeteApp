var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


// Meal schema 
var MealSchema   = new Schema({
  id:     {type:Number},
  change: {type: Number},
  date:   {type: Date},
});

module.exports = mongoose.model('Meal', MealSchema);