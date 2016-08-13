angular.module('mainCtrl', ['ngMaterial',])

.controller('MainController', function($rootScope, $location, Auth,$window,$scope) {
  var vm = this;

  $scope.currentNavItem = $location.path();

  vm.goLogIn = function(){
  	$window.location.href = '/api/auth/google';
  }

  $rootScope.userData = Auth;

  vm.logOut = function(){
    Auth.logOut();
    $window.location.href = '/login';
  };
});
