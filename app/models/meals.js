var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


// Meal schema 
var MealSchema   = new Schema({
	change: {type: Number},
  date:   {type: Date},
  id:     {type: Number},
  moment: {type: Number},  // 0->Breakfast 1->Lunch 2->Dinner
  reqDate: {type: Date},
});

MealSchema.index({ id: 1, date: 1, moment:1 }, { unique: true })

module.exports = mongoose.model('Meal', MealSchema);