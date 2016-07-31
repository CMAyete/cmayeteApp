angular.module('cmayete', ['ngAnimate', 'app.routes', 'AuthService', 'mainCtrl','ngMaterial','angular-jwt','mealCtrl', 'MealService', 'settingsCtrl', 'SettingsService','bookCtrl', 'BookService'])

.config(function ($httpProvider) {
  console.log("Aqui");
  $httpProvider.interceptors.push('authInterceptor');
})

.run(function ($rootScope, $location) {
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    // if route requires auth and user is not logged in
    var authorizedRoles = next.data.reqPermissions;
    var redirect = next.data.redirect;
    if (next.originalPath != '/login' && $rootScope.userData[authorizedRoles] != true) {
      event.preventDefault();
      $location.path(redirect);
    }else if(next.originalPath == '/login' && $rootScope.userData[authorizedRoles] == true){
      event.preventDefault();
      $location.path(redirect);
    }
  });
});