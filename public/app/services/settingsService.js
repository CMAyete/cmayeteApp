angular.module('SettingsService', [])

.factory('Settings', function($http) {

  // create a new object
  var SettingsFactory = {};
  var savedUser;

  // Get initial data count
  SettingsFactory.prepareData = function() {
    return $http.get('/api/settings');
  };

  // Clear collection data
  SettingsFactory.clearCollection = function(collection) {
    var config = { params:{
                chosen: collection
              }};
    return $http.delete('/api/settings/', config);
  };

  // get all users
  SettingsFactory.all = function(current) {
    var config = { params:{
                    page: current
                  }};
    return $http.get('/api/users/', config);
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