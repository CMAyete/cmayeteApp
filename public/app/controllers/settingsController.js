angular.module('settingsCtrl', ['ngMaterial',])

.controller('SettingsController', function($rootScope, $location, Settings,$window,$mdDialog) {
  var vm = this;

  vm.settingsData = {
    lastMealsDate: new Date(),
    mealsInDB: 0,
    usersInDB: 0,
    booksInDB: 0,
    matchesInDB: 0,
  }

  vm.user = {
    email: '',
    number: '',
    admin: false,
    meals: false,
    library: false,
    hasDiet: false,
    dietContent: '',
  };

  vm.currentPage = 1;
  vm.numPages;
  vm.sendButtonText = 'Enviar';
  vm.isUpdate = false;

  vm.gotoUsersList = function(){
    $location.path('/usersList');
  }

  vm.gotoAddUser = function(){
    $location.path('/addUser');
  }

  vm.clearAll = function(collection){
    Settings.clearCollection(collection).then(function(data){
      vm.loadSettingsData();
    });
  }

  vm.loadSettingsData = function(){
    Settings.prepareData().success(function(data){
      vm.settingsData = data;
    });
  };

  if(Settings.getcurrentEditUser()){
    Settings.findUserbyIDNum(Settings.getcurrentEditUser()).then(function(data){
      vm.user = data.data;
    });
    vm.isUpdate = true;
    vm.sendButtonText = 'Actualizar';
  }

  vm.openDial = function(execFunction, collection, event) {
    var confirm = $mdDialog.confirm()
          .title('¿Estás seguro?')
          .textContent('Esta acción no se podrá deshacer.')
          .ariaLabel('Confirmar')
          .ok('Continuar')
          .cancel('Cancelar')
          .targetEvent(event);
    $mdDialog.show(confirm).then(function() {
      execFunction(collection);
    });
  };

  vm.getUsers = function() {
    Settings.all(vm.currentPage)
      .success(function(data) {
        vm.processing = false;
        vm.users = data.users;
        vm.numPages = data.nump;
      });
  }

  vm.nextPressed = function(){
    ++vm.currentPage;
    vm.getUsers();
  }

  vm.prevPressed = function(){
    --vm.currentPage;
    vm.getUsers();
  }

  vm.deleteUser = function(id){
    vm.processing = true;
    Settings.delete(id)
      .success(function(data){
        vm.processing = false;
        vm.users = data;
        $location.path("/usersList");
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
    Settings.create(vm.user).success(function(data){
      vm.sendButtonText = 'Enviado';
    });
  }

  vm.addUser = function(){
    Settings.clearcurrentEditUser();
    $location.path("/addUser");
  }

  vm.editUser = function(user_id){
    Settings.setcurrentEditUser(user_id);
    $location.path("/addUser");
  }

  vm.editedUser = function(){
    Settings.updateUserByID(vm.user._id,vm.user);
  }

});