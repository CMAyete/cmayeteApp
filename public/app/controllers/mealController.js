angular.module('mealCtrl',[])

.controller('MealController', function($rootScope,Meal,$timeout,$mdDialog,$mdMedia) {

  var Meals = {};
  var vm=this;

  vm.pickDate = new Date();
  vm.repeat = false;
  vm.endDate = new Date();

  vm.possibleRepeats = [
    {id: 1, name: 'Cada día'},
    {id: 7, name: 'Cada semana'}
  ]

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

  vm.dayBeforeIDkeys = ['NoD','D1','BD1','BT1','BD','BC'];

  vm.selectedRequest = { id: 'NoC', name: 'Tachar la cena' };

  vm.mealAsked = {};
  vm.mealAsked.doRepeat = 0;
  vm.mealButtontext = 'Enviar';

  // Ask for a new meal change
  vm.askMeal = function() {
  if(vm.dayBeforeIDkeys.indexOf(vm.mealAsked.change) !== -1){
    vm.mealAsked.date = new Date(vm.mealAsked.date.setDate(vm.mealAsked.date.getDate()-1));
  }
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
    if(vm.repeat){
      var requestMeal = [{}];
      var i=0;
      requestMeal[i] = angular.copy(vm.mealAsked);
        while(requestMeal[i].date <= vm.mealAsked.endDate){
        (function(request) {
        Meal.create(request)
          .success(function() {
            vm.processing = false;
            vm.mealButtontext = 'Enviado';
          }).error(function() {
            vm.processing = false;
            vm.mealButtontext = 'Error';
            vm.mealError = true;
          });
        })(requestMeal[i]);
        ++i;
        requestMeal[i] = angular.copy(vm.mealAsked);
        requestMeal[i].date = new Date(requestMeal[i].date.setDate(requestMeal[i-1].date.getDate()+Number(vm.mealAsked.doRepeat)));  
      }
    }else{
      //Create the meal with special response to errors or success
      Meal.create(vm.mealAsked)
        .success(function() {
          vm.processing = false;
          vm.mealButtontext = 'Enviado';
          vm.myMeals();
        }).error(function() {
          vm.processing = false;
          vm.mealButtontext = 'Error';
          vm.mealError = true;
        });
    }
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
        data.map(function(e){
          e.date = new Date(e.date);
          e = vm.modifyMealView(e);
        });
        vm.myRequests = data;
      });
  }

  vm.getMeals = function(date) {
    Meal.inDay(date)
      .success(function(data){
        vm.processing = false;
        data.map(function(e){
          e = vm.checkDiets(e);
        });
        vm.requests = data;
      });
  }

  // function to delete a change
  vm.deleteRequest = function(id) {
    vm.processing = true;
    Meal.delete(id)
      .success(function(data) {
        vm.myMeals();
    });
  };

  vm.modifyMealView = function(meal){
    if(vm.dayBeforeIDkeys.indexOf(meal.change) !== -1){
      meal.date = meal.date.setDate(meal.date.getDate()+1);
      meal.showDate = true;
    }
  }

  vm.checkDiets = function(meal){
    Meal.hasDiet(meal.id)
      .success(function(data){
        //To avoid undefined warnings
        if(data[0]){
          if(data[0].hasDiet){
            meal.dietMeal = true;
          }
        }
      });
  }


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