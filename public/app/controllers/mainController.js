angular.module('mainCtrl', ['ngMaterial',])

.controller('MainController', function($rootScope, $location, Auth,$window) {
  var vm = this;

  $rootScope.currentLink = 'meals';

  vm.currentNavItem = 'meals';

  vm.goLogIn = function(){
  	$window.location.href = '/api/auth/google';
  }

  $rootScope.userData = Auth;

  vm.logOut = function(){
    Auth.logOut();
    $window.location.href = '/login';
  };
});
