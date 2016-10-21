var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


// Meal schema 
var MealSchema   = new Schema({
  id:     {type: Number},
  change: {type: Number},
  date:   {type: Date},
  reqDate: {type: Date},
  moment: {type: Number}  // 0->Breakfast 1->Meal 2->Dinner
});

module.exports = mongoose.model('Meal', MealSchema);