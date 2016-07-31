angular.module('settingsCtrl', ['ngMaterial',])

.controller('SettingsController', function($rootScope, $location, Settings,$window) {
  var vm = this;

  vm.user = {
    Name: '',
    Email: '',
    Number: '',
    Admin: false,
    Meals: false,
    Library: false,
  };

  vm.getUsers = function() {
    Settings.all()
      .success(function(data) {
        vm.processing = false;
        vm.users = data;
      });
  }

  vm.deleteUser = function(id){
    vm.processing = true;
    console.log(id);
    Settings.delete(id)
      .success(function(data){
        vm.processing = false;
        vm.users = data;
      });
  }

  vm.isChecked = function(item){
    return vm.user[item];
  }
  vm.toggle = function(item){
    vm.user[item] = !vm.user[item];
    return vm.user[item];
  }

  vm.send = function(){
    console.log(vm.user);
    Settings.create(vm.user);
    vm.getUsers();
  }

});