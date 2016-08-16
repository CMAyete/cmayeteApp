angular.module('sportsCtrl', ['ngMaterial',])

.controller('SportsController', function(Sport, $location) {
  var vm = this;

  vm.isUpdate = false;
  vm.search = '';
  vm.sendButtonText = 'Enviar';
  vm.numPages;
  vm.matches;
  vm.currentPage = 1;

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
      data.data.playersList = data.data.playersList[0];
      data.data.date = new Date(data.data.date);
      data.data.startTime = new Date(data.data.startTime);
      data.data.endTime = new Date(data.data.endTime);
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
        vm.matches = data.matches;
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

  vm.deleteMatch = function(id){
    vm.processing = true;
    Sport.delete(id)
      .success(function(data){
        vm.processing = false;
        vm.getSports();
      });
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

  vm.nextPressed = function(){
    ++vm.currentPage;
    vm.getSports();
  }

  vm.prevPressed = function(){
    --vm.currentPage;
    vm.getSports();
  }

  vm.editedMatch = function(){
    Sport.updateSportByID(vm.match._id,vm.match);
  }

  vm.editMatch = function(match_id){
    Sport.setcurrentEditSport(match_id);
    $location.path("/addSport");
  }

  vm.playersNum = function(match){
    var totalCount = 0;
    var i=0;
    for(i=0;i<match.numberOfTeams;++i){
      totalCount += Object.keys(match.playersList[0][i]).length;
    }
    return totalCount;
  }


});