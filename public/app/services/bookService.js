angular.module('BookService', [])

.factory('Book', function($http) {

  // create a new object
  var BookFactory = {};

  // get all books
  BookFactory.all = function(name,current){
    var config = { params:{
                    search: name,
                    page:current
                  }};
    return $http.get('/api/books/' ,config);
  };

  // add a book
  BookFactory.create = function(BookData) {
    return $http.post('/api/books', BookData);
  };

  // delete a book
  BookFactory.delete = function(id) {
    return $http.delete('/api/books/' + id);
  };

  // find book data
  BookFactory.findData = function(dataField,searchText) {
    var config = { params:{
                field: dataField,
                search:searchText
              }};
    return $http.get('/api/booksData/',config);
  };

  BookFactory.getMyBooks = function(userNumber) {
    var config = { params:{
                idNum: userNumber,
              }};
    return $http.get('/api/myBooks/',config);
  };

  BookFactory.manageMyBook = function(bookID,userNumber) {
    var config = { params:{
                MongoID: bookID,
                idNum: userNumber,
              }};
              console.log(config);
    return $http.put('/api/myBooks/', config);
  };
  
  return BookFactory;

});