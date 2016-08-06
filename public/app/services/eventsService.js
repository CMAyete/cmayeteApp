angular.module('EventsService', [])

.factory('Events', function($http) {

  // create a new object
  var EventsFactory = {};

  // get all events from given calendar
  EventsFactory.mainCal = function(calendarURL,APIKey,numberEvents) {
    var today = new Date();
    var config = { params:{
                key:  APIKey,
                timeMin: today,
                singleEvents: true,
                orderBy: 'startTime',
                maxResults: numberEvents,
              }};
    return $http.get('https://www.googleapis.com/calendar/v3/calendars/' + calendarURL + '/events', config);
  };

  EventsFactory.otherCals = function(calendarURL,APIKey,maxDate){
    var today = new Date();
    var config = { params:{
                key:  APIKey,
                timeMin: today,
                singleEvents: true,
                orderBy: 'startTime',
                timeMax: new Date(maxDate),
              }};
    return $http.get('https://www.googleapis.com/calendar/v3/calendars/' + calendarURL + '/events', config);
  };

  return EventsFactory;

});