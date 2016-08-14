// Import enviroment variables
var __env = {};

if(window){  
  Object.assign(__env, window.__env);
}

angular.module('cmayete', ['ngAnimate', 'app.routes', 'AuthService', 'mainCtrl','ngMaterial','angular-jwt','mealCtrl', 'MealService', 'settingsCtrl', 'SettingsService','bookCtrl', 'BookService','angular.filter','eventsCtrl','EventsService','sportsCtrl','SportsService'])

.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('brown', {
      'default': '500',
      'hue-1': '100',
      'hue-2': '700',
    })
    .accentPalette('orange', {
      'default': '500'
    });
})

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

.constant('_env', _env)

/* 
  Directive from https://mark.zealey.org/2015/01/08/formatting-time-inputs-nicely-with-angularjs
 */             
.directive('ngModel', function( $filter ) {
    return {
        require: '?ngModel',
        link: function(scope, elem, attr, ngModel) {
            if( !ngModel )
                return;
            if( attr.type !== 'Time' )
                return;
                    
            ngModel.$formatters.unshift(function(value) {
                return value.replace(/:[0-9]{2}\.[0-9]{3}$/, '')
            });
        }
    }   
}); 