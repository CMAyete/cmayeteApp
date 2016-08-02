angular.module('bookCtrl', ['ngMaterial'])

.controller('BooksController', function($rootScope, $location, Book,$window) {
  var vm = this;

  vm.search = "";
  vm.currentPage = 1;
  vm.numPages;

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
    Book.all(vm.search,vm.currentPage)
      .success(function(data) {
        vm.processing = false;
        vm.books = data.books;
        vm.numPages = data.nump;
        console.log(data);
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

  vm.nextPressed = function(){
    ++vm.currentPage;
    vm.getBooks();
  }

  vm.prevPressed = function(){
    --vm.currentPage;
    vm.getBooks();
  }

});