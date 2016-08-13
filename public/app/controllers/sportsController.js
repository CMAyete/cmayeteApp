angular.module('sportsCtrl', ['ngMaterial',])

.controller('SportsController', function(Sport) {
  var vm = this;

  vm.isUpdate = false;
  vm.search = '';
  vm.sendButtonText = 'Enviar';
  vm.numPages;

  vm.match = {
    name: '',
  	place: '',
  	playersPerTeam: 1,
  	numberOfTeams: 2,
  	date: new Date(),
  	startTime: new Date(),
  	endTime: new Date(),
  	isLocked: false,
  	playersList: [1][''],
    waitingList: false,
  }

  if(Sport.getcurrentEditSport()){
    Sport.findSportbyIDNum(Sport.getcurrentEditSport()).then(function(data){
      vm.match = data.data;
      console.log(vm.match);
    });
    console.log(vm.match);
    vm.isUpdate = true;
    vm.sendButtonText = 'Actualizar';
  }

  vm.getSports = function() {
    Sport.all(vm.currentPage)
      .success(function(data) {
        vm.processing = false;
        vm.match = data.match;
        vm.numPages = data.nump;
      });
  }

  vm.getNumber = function(number){
  	return new Array(number); 
  }

  vm.editedMatch = function(){
  	console.log(typeof vm.match.playersList);
  	console.log(vm.match);

  }

  vm.addMatch = function(){
  	console.log(typeof vm.match.playersList);
  	console.log(vm.match);
  	Sport.create(vm.match);
  }

  vm.matchData = function(dataField,searchText) {
    return Sport.findData(dataField,searchText)
      .then(function(data) {
        vm.processing = false;
        return data.data;
      });
  }

  vm.selectedItemChange = function(item,id){
    vm.match.place = item;
  }

  vm.newData = function(search,id){
    vm.match.place = search;
  }


});