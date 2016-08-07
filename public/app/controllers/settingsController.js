angular.module('settingsCtrl', ['ngMaterial',])

.controller('SettingsController', function($rootScope, $location, Settings,$window) {
  var vm = this;

  vm.user = {
    email: '',
    number: '',
    admin: false,
    meals: false,
    library: false,
    hasDiet: false,
    dietContent: '',
  };

  vm.sendButtonText = 'Enviar';
  vm.isUpdate = false;

  if(Settings.getcurrentEditUser()){
    console.log("Hola");
    console.log(Settings.getcurrentEditUser());
    Settings.findUserbyIDNum(Settings.getcurrentEditUser()).then(function(data){
      vm.user = data.data;
      console.log("data " + data.data);
      console.log(vm.user);
    });
    console.log(vm.user);
    vm.isUpdate = true;
    vm.sendButtonText = 'Actualizar';
  }


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

  vm.addNewUser = function(){
    console.log(vm.user);
    Settings.create(vm.user).success(function(data){
      vm.sendButtonText = 'Enviado';
    });
  }

  vm.editUser = function(user_id){
    Settings.setcurrentEditUser(user_id);
    $location.path("/addUser");
  }

  vm.editedUser = function(){
    Settings.updateUserByID(vm.user._id,vm.user);
  }

});