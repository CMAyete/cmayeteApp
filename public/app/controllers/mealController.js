angular.module('mealCtrl',[])

.controller('MealController', function($rootScope,Meal,$timeout,$mdDialog,$mdMedia,$scope) {

  var Meals = {};
  var vm=this;

  vm.possibleRequests = [
    { id: 'NoD', name: 'Tachar el desayuno' },
    { id: 'NoK', name: 'Tachar la comida' },
    { id: 'NoC', name: 'Tachar la cena' },
    { id: 'D1',  name: 'Desayunar antes' },
    { id: 'BD1', name: 'Bocadillos en primer turno' },
    { id: 'BT1', name: 'Tupper en primer turno' },
    { id: 'BD', name: 'Comer de Tupper' },
    { id: 'BC', name: 'Bolsa de bocadillos antes de las 13:00' },
    { id: 'K1', name: 'Comida de primer turno' },
    { id: 'K2', name: 'Comida de segundo turno' },
    { id: 'C2', name: 'Cena de segundo turno' },
  ];

  vm.selectedRequest = { id: 'NoC', name: 'Tachar la cena' };

  vm.mealAsked = {};
  vm.mealButtontext = 'Enviar';

  // Ask for a new meal change
  vm.askMeal = function() {
  if(!vm.mealAsked.id || !vm.mealAsked.change || !vm.mealAsked.date || (vm.mealAsked.date < vm.currentDate)){
    vm.mealButtontext = 'Error';
    vm.mealError = true;

    // Get the button back to normal  
    $timeout(function(){
      vm.mealButtontext = 'Enviar';
      vm.mealError = false;
    },3000);
    
  }else{
    
    vm.processing = true;
    vm.mealButtontext = '';
    //Create the meal with special response to errors or success
    Meal.create(vm.mealAsked)
      .success(function() {
        vm.processing = false;
        vm.mealButtontext = 'Enviado';
        vm.myMeals();
      }).error(function(){
        vm.processing = false;
        vm.mealButtontext = 'Error';
        vm.mealError = true;
      });

    // Get the button back to normal  
    $timeout(function(){
        vm.mealError = false;
        vm.mealButtontext = 'Enviar';
    },3000); 
  };

  }

  vm.myMeals = function() {
    Meal.mine($rootScope.userData.number)
      .success(function(data) {
        vm.processing = false;
        vm.myRequests = data;
      });
  }

  vm.getMeals = function() {
    Meal.all()
      .success(function(data) {
        vm.processing = false;
        vm.requests = data;
      });
  }

  // function to delete a change
  vm.deleteRequest = function(id) {
    vm.processing = true;

    Meal.delete(id)
      .success(function(data) {
        vm.myMeals();
        vm.getMeals();
    });
  };


  /*
      Manage the minimum day for the input form
  */
  
  // Retrieve last authorised day from db
  vm.getLastDay = function() {
	  Meal.getCurrentDate()
	    .success(function(data) {
	    	vm.currentDate = data;
	  	});
  };


  // Change to current day
  vm.NewDate = function() {
    vm.processing = true;
    vm.message = '';
    Meal.update()
      .success(function(data) {
        vm.processing = false;
        vm.currentDate = data;
      });
  };

});