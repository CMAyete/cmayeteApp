angular.module('SettingsService', [])

.factory('Settings', function($http) {

  // create a new object
  var SettingsFactory = {};

  // get all meals
  SettingsFactory.all = function() {
    return $http.get('/api/users/');
  };

  // make a new change
  SettingsFactory.create = function(UserData) {
    return $http.post('/api/users', UserData);
  };

  // delete a meal
  SettingsFactory.delete = function(id) {
    return $http.delete('/api/users/' + id);
  };

  
  return SettingsFactory;

});