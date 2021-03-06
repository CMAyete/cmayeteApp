angular.module('eventsCtrl', ['ngMaterial'])

.controller('EventsController', function($rootScope,Events) {
  var vm = this;

  vm.monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  vm.maxDate = new Date();

  vm.list = [];

  vm.getEvents = function(){
    return Events.mainCal('ayete.es_pu5p3ltp22t89tvn783vuoph84@group.calendar.google.com',$rootScope.userData.GCalendarAPI,3)
            .then(function(data){
              data.data.items.map(function(e){
                e = prepareDates(e);
              });
              vm.list = data.data.items;
              vm.maxDate = vm.list[vm.list.length-1].end.dateTime;
              vm.getOtherCals('ayete.es_rj8b8qv272ja3th2lf1f4cuc38@group.calendar.google.com');
              vm.getOtherCals('ayete.es_fc18psm9lvh9d2dbn9a4c7uocc@group.calendar.google.com');
            });
  }

  vm.getOtherCals = function(calendarURL){
    return Events.otherCals(calendarURL,$rootScope.userData.GCalendarAPI,vm.maxDate)
            .then(function(data){
              data.data.items.map(function(e){
                e = prepareDates(e);
              });
              vm.list = vm.list.concat(data.data.items);
              vm.list = vm.list.sort(function(a,b){
                if(a.start.dateTime < b.start.dateTime) return -1;
                if(a.start.dateTime > b.start.dateTime) return 1;
                return 0;
              })
              vm.list = vm.list.slice(0, 10);
            });
  }

  prepareDates = function(item){
    if(!item.start.dateTime){
      item.start.dateTime = new Date(item.start.date);
    }else{
      item.start.dateTime = new Date(item.start.dateTime);
    }
    if(!item.end.dateTime){
      item.end.dateTime = new Date(item.end.date);
    }else{
      item.end.dateTime = new Date(item.end.dateTime);
    }
    if(item.end.dateTime.getDate() == item.start.dateTime.getDate()+1){
      item.start.wholeDay = true;
    }else{
      item.start.wholeDay = false;
    }
    if(!item.start.wholeDay && item.end.dateTime.getDay() != item.start.dateTime.getDay()){
      item.start.manyDays = true;
    }else{
      item.start.manyDays = false;
    }
    return item;
  }

});