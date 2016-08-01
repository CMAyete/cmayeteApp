angular.module('MealService', [])

.factory('Meal', function($http) {

  // create a new object
  var MealFactory = {};

  // get all meals
  MealFactory.all = function() {
    return $http.get('/api/meals/');
  };

  // get user meal
  MealFactory.mine = function(id) {
    return $http.get('/api/userMeals/' + id);
  };

  // get user meal
  MealFactory.inDay = function(pickDate) {
    return $http.get('/api/meals/' + pickDate);
  };


  // make a new change
  MealFactory.create = function(MealData) {
    return $http.post('/api/meals', MealData);
  };

  // delete a meal
  MealFactory.delete = function(id) {
    return $http.delete('/api/meals/' + id);
  };



  // MEAL DATES LIMIT
  
  MealFactory.getCurrentDate = function() {
    return $http.get('/api/lastdate/');
  };

  MealFactory.update = function() {
    return $http.put('/api/lastdate/');
  };
  
  return MealFactory;

});