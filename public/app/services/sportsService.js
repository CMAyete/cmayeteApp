angular.module('SportsService', [])

.factory('Sport', function($http) {

  // create a new object
  var SportsFactory = {};
  var savedSport;

  // add a match
  SportsFactory.create = function(matchData) {
    return $http.post('/api/sports', matchData);
  };

  // find a match by ID Number
  SportsFactory.updateSportByID = function(id, SportData) {
    console.log(SportData);
    return $http.put('/api/sports/' + id, SportData);
  };

  // find match data
  SportsFactory.findData = function(dataField,searchText) {
    var config = { params:{
                field: dataField,
                search:searchText
              }};
    return $http.get('/api/sportsData/',config);
  };

  SportsFactory.setcurrentEditSport = function(sport){
    savedSport = sport;
  }

  SportsFactory.getcurrentEditSport = function(){
    return savedSport;
  }

  return SportsFactory;

});