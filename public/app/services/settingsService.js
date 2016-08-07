angular.module('SettingsService', [])

.factory('Settings', function($http) {

  // create a new object
  var SettingsFactory = {};
  var savedUser;

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

  // find a user by ID Number
  SettingsFactory.findUserbyIDNum = function(id) {
    return $http.get('/api/users/' + id);
  };

  // Update user by ID Number
  SettingsFactory.updateUserByID = function(id, userData) {
    console.log(userData);
    return $http.put('/api/users/' + id, userData);
  };

  SettingsFactory.setcurrentEditUser = function(user){
    savedUser = user;
  }

  SettingsFactory.getcurrentEditUser = function(){
    return savedUser;
  }

  
  return SettingsFactory;

});