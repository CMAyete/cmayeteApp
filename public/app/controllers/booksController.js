angular.module('bookCtrl', ['ngMaterial'])

.controller('BooksController', function($rootScope, $location, Book,$window) {
  var vm = this;

  vm.search;

  vm.book = {
    id: '',
    numero: '',
    letra: '',
    apellidos: '',
    nombre: '',
    titulo: '',
    idioma: '',
    lugar: '',
  };

  vm.getBooks = function() {
    Book.all()
      .success(function(data) {
        vm.processing = false;
        vm.books = data;
      });
  }

  vm.deleteBook = function(id){
    vm.processing = true;
    console.log(id);
    Book.delete(id)
      .success(function(data){
        vm.processing = false;
        vm.books = data;
      });
  }
  
  vm.send = function(){
    Book.create(vm.book);
    vm.getUsers();
  }

});