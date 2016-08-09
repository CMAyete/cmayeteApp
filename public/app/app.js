// Import enviroment variables
var __env = {};

if(window){  
  Object.assign(__env, window.__env);
}

angular.module('cmayete', ['ngAnimate', 'app.routes', 'AuthService', 'mainCtrl','ngMaterial','angular-jwt','mealCtrl', 'MealService', 'settingsCtrl', 'SettingsService','bookCtrl', 'BookService','angular.filter','eventsCtrl','EventsService','sportsCtrl','SportsService'])

.config(function ($httpProvider,$mdDateLocaleProvider) {
  $httpProvider.interceptors.push('authInterceptor');
  $mdDateLocaleProvider.formatDate = function(date) {
   return date ? moment(date).format('DD-MM-YYYY') : '';
  };
  $mdDateLocaleProvider.parseDate = function(dateString) {
   var m = moment(dateString, 'DD-MM-YYYY', true);
   return m.isValid() ? m.toDate() : new Date(NaN);
  };
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
})

.constant('_env', _env); 