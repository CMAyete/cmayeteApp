angular.module('mealCtrl',[])

.controller('MealController', function($rootScope,Meal,$timeout,$mdDialog,$mdMedia, $q) {

  var Meals = {};
  var vm=this;

  vm.pickDate = new Date();
  vm.repeat = false;
  vm.endDate = new Date();
  vm.currentDate = new Date();

  vm.possibleRepeats = [
    {id: 1, name: 'Cada día'},
    {id: 7, name: 'Cada semana'}
  ]

  vm.possibleRequests = [
    /*  0 */ 'Tachar el desayuno' ,
    /*  1 */ 'Tachar la comida',
    /*  2 */ 'Tachar la cena',
    /*  3 */ 'Desayunar antes',
    /*  4 */ 'Bocadillos en primer turno',
    /*  5 */ 'Tupper en primer turno',
    /*  6 */ 'Comer de Tupper',
    /*  7 */ 'Comer de Bocadillos',
    /*  8 */ 'Bolsa de bocadillos antes de las 13:00',
    /*  9 */ 'Comida de primer turno',
    /* 10 */ 'Comida de segundo turno',
    /* 11 */ 'Cena de segundo turno',
  ];

  vm.dayBeforeIDkeys = [0,3,4,5,6,7];

  vm.selectedRequest = 2;

  vm.mealAsked = {};
  vm.mealAsked.date = new Date();  
  vm.mealAsked.doRepeat = 0;
  vm.mealButtontext = 'Enviar';

  // Ask for a new meal change
  vm.askMeal = function() {
  vm.processing = true;
  vm.mealButtontext = '';
  if(vm.verifyMeal()){
    if(vm.repeat){
      var promiseArray = [];
      var i=0;
      while(vm.mealAsked.date <= vm.mealAsked.endDate){
        promiseArray.push(Meal.create(angular.copy(vm.mealAsked)));
        vm.mealAsked.date = new Date(vm.mealAsked.date.setDate(vm.mealAsked.date.getDate()+Number(vm.mealAsked.doRepeat)));
      }
      $q.all(promiseArray)
        .then(
          function () {
            vm.processing = false;
            vm.mealButtontext = 'Enviado';
            vm.myMeals();
          },
          function () {
            vm.processing = false;
            vm.mealButtontext = 'Error';
            vm.mealError = true;
          }
        );
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
    }else{
      vm.mealButtontext = 'Error';
      vm.mealError = true;
    }
    // Get the button back to normal  
    $timeout(function(){
    vm.mealButtontext = 'Enviar';
    vm.mealError = false;
    },3000);
  }

  vm.verifyMeal = function(){
    if(vm.dayBeforeIDkeys.indexOf(vm.mealAsked.change) !== -1){
      vm.mealAsked.date = new Date(vm.mealAsked.date.setDate(vm.mealAsked.date.getDate()-1));
    }
    if(!vm.mealAsked.id || (!vm.mealAsked.change && vm.mealAsked.change!=0) || !vm.mealAsked.date){
      return false;
    }
    if(vm.mealAsked.date < vm.currentDate){
      return false;
    }
    if(vm.repeat){
      if(vm.mealAsked.date >= vm.mealAsked.endDate){
        return false;
      }
      if(vm.mealAsked.endDate < vm.currentDate){
        return false;
      }
    }
    return true;
  }

  vm.myMeals = function() {
    Meal.mine($rootScope.userData.number)
      .success(function(data) {
        vm.processing = false;
        data.map(function(e){
          e.date = new Date(e.date);
          if(vm.dayBeforeIDkeys.indexOf(e.change) != -1){
            e.showDate = new Date();
            e.showDate = new Date(e.showDate.setDate(e.date.getDate()+1));
          }else{
            e.showDate = e.date;
          }
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
	    	vm.currentDate = new Date(data);
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