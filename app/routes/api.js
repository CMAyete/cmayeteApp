// Load packages
// ================
var Meal       = require('../models/meals');
var User       = require('../models/users');
var Book       = require('../models/books');
var Sport      = require('../models/sports');
var LastDate   = require('../models/lastDate');
var jwt        = require('jsonwebtoken');
//var config     = require('../config/config');

// keys and data
// ================
var secret    = process.env.SECRET || config.secret;
var minimumMealsDay = process.env.MINDAY || new Date().setTime(config.minday);
var defaultUserMail = process.env.DEFAULTUSER || config.defaultUser;
var GCalendarAPI = process.env.GCALKEY || config.gCalApiKey;

// API Code
// =========
module.exports = function(app, express, passport) {

  var apiRouter = express.Router();


  apiRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile','email'],prompt : "select_account" }));
  apiRouter.get('/auth/google/callback', function(req, res, next){
  passport.authenticate('google', {session: false, successRedirect: express.hostname + '/meals',failureRedirect: express.hostname},
    function(err, user, info){
      if (err){
        return next(err);
      }
      if(user == defaultUserMail){
        var token = jwt.sign({
                              number:55,
                              isLogged:true,
                              email:user,
                              admin:true,
                              meals:true,
                              library:true,
                              calendarAPI: GCalendarAPI,
                              },
                              secret,{
                                expiresIn: 11520 // expires in 8 days
                              });
        res.cookie('cmayete', token);
        res.redirect('/meals');
      }else{
        var userData;
        User.findOne({'email':user},function(err,userfound){
          if(userfound){
            userData = userfound;
                        var token = jwt.sign({
                                  number: userData.number,
                                  isLogged: true,
                                  email: userData.email,
                                  admin: userData.admin,
                                  meals: userData.meals,
                                  library: userData.library,
                                  calendarAPI: GCalendarAPI,
                                  },
                                  secret,{
                                    expiresIn: "15d" // expires in 8 days
                                  });

            res.cookie('cmayete', token);
            res.redirect('/meals');  
          }else{
            res.redirect('/login#error');
          }
        });
      }
    })(req, res, next);
  });

  apiRouter.use(function(req, res, next) {
    console.log('Alguien está usando la app!');
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, secret, function(err, decoded) {      
        if (err) {
          res.clearCookie('cmayete');
          res.status(403).send({ 
            success: false, 
            message: 'Auth error.', 
        });      
        } else { 
          req.decoded = decoded;
          User.findOne({'email':req.decoded.email},function(err,userfound){
          if(userfound || req.decoded.email == defaultUserMail){
                        var token = jwt.sign({
                                  number: req.decoded.number,
                                  isLogged: true,
                                  email: req.decoded.email,
                                  admin: req.decoded.admin,
                                  meals: req.decoded.meals,
                                  library: req.decoded.library,
                                  calendarAPI: GCalendarAPI,
                                  },
                                  secret,{
                                    expiresIn: "15d" // expires in 8 days
                                  });

            res.cookie('cmayete', token);
            next();
          }else{
            res.clearCookie('cmayete');
            return res.status(403).send({ 
              success: false, 
              message: 'Invalid User' 
            });
          }})
        }
      });
    }else {
      return res.status(403).send({ 
        success: false, 
        message: 'No token found' 
      });
    }
  });

  // Meals section
  // ----------------------------------------------------
  apiRouter.route('/meals')

    // create a meal (accessed at POST /api/meals)
    .post(function(req, res) {
      var meal = new Meal();            
      meal.id = req.body.id;            
      meal.change = req.body.change;    
      meal.date = req.body.date;
      meal.reqDate = req.body.reqDate;  
      meal.moment = req.body.moment;      
      meal.save(function(err) {
        if (err) {
          res.sendStatus(409);
        }else{
          res.json({ message: 'Cambio registrado!' });
        }
      });

    })

    .get(function(req, res) {
      Meal.find(function(err, meals) {
        if (err){
          return err;
        }else{
          // return the meals
          return res.json(meals);
        }
      });
    });

  apiRouter.route('/meals/:meal_date')
    .get(function(req, res) {
      Meal.find({
        reqDate: req.params.meal_date
      },function(err, meals) {
          if (err) res.send(err);
            if (err){
              return err;
            }else{
              // return the meals
              return res.json(meals);
            }
        });
    });

  apiRouter.route('/meals/:meal_id')
    .delete(function(req, res) {
      Meal.remove({
        _id: req.params.meal_id
      },function(err, meal) {
          if (err) res.send(err);
          Meal.find(function(err, meals) {
            if (err){
              return err;
            }else{
              return res.json(meals);
            }
          });
        });
    });

  apiRouter.route('/userMeals/:meal_id')
    .get(function(req, res) {
      Meal.find({
        id: req.params.meal_id, date: {$gte : new Date(new Date().setDate(new Date().getDate()-2))}
      },function(err, meals) {
          if (err) res.send(err);
            if (err){
              return err;
            }else{
              // return the meals
              return res.json(meals);
            }
        });
    })

  apiRouter.route('/allowedMealsNumber')
    .get(function(req, res) {
      User.distinct('number' , function(err,data){
          if (err) res.send(err);
            if (err){
              return err;
            }else{
              // return the numbers array
              return res.json(data);
            }
      });
    })

  apiRouter.route('/lastdate')
    .post(function(req, res) {
      var date = new LastDate();            
      date.date = req.body.timestamp;  
      date.save(function(err) {
        if (err) {
          res.sendStatus(500);
        }else{
          res.sendStatus(200);
        }
      });
    })
    .put(function(req, res) {
      LastDate.findOneAndUpdate({_id: req.body.id},{
        date: req.body.timestamp,
      },function(err, data) {
        if (err){
          return err;
        }else{
          return res.json(data);
        }
      });
    });

  apiRouter.route('/lastdate/:date_id')
    .get(function(req, res) {
      LastDate.find({
        _id: req.params.date_id
      },function(err, lastdate) {
          if (err) res.send(err);
            if (err){
              return err;
            }else{
              return res.json(lastdate);
            }
        });
    })

  // User Management section
  // ----------------------------------------------------
  apiRouter.route('/users')
    .post(function(req,res){
      var user = new User();
      user.email = req.body.email;
      user.number = req.body.number;
      user.admin = req.body.admin;
      user.meals = req.body.meals;
      user.library = req.body.library;
      user.hasDiet = req.body.hasDiet;
      user.dietContent = req.body.dietContent;
      user.save(function(err){
        if(err){
          if (err.code == 11000) 
            return res.json({ success: false, message: 'Ya existe ese usuario'});
          else 
            return res.send(err);
        }
        res.json({ message: 'Usuario creado' });
      })
    })

    .get(function(req, res) {
      var currentPage = req.query.page-1;
      User.find(function(err, users) {
        if (err){
          return err;
        }else{
            User.find().count().exec(function (err,count) {
            var nump = Math.ceil(count/10);
            return res.json({users,nump});
          })
        }
      }).sort({numero: -1}).skip(currentPage*10).limit(10); //Remove use of SKIP, see $lt
    });

  apiRouter.route('/userDiets/:user_num')
    .get(function(req, res) {
      User.find({number: req.params.user_num},function(err, data) {
        if (err){
          return err;
        }else{
          return res.json(data);
        }
      });
    });

  apiRouter.route('/users/:user_id')
    .get(function(req, res) {
      User.findById({_id: req.params.user_id},function(err, data) {
        if (err){
          return err;
        }else{
          console.log(data);
          return res.json(data);
        }
      });
    })
    .put(function(req, res) {
      User.findOneAndUpdate({_id: req.params.user_id},{
        email: req.body.email,
        number: req.body.number,
        admin: req.body.admin,
        meals: req.body.meals,
        library: req.body.library,
        hasDiet: req.body.hasDiet,
        dietContent: req.body.dietContent,
      },function(err, data) {
        if (err){
          return err;
        }else{
          return res.json(data);
        }
      });
    })
    .delete(function(req, res) {
      User.remove({
        _id: req.params.user_id
      },function(err, user) {
          if (err) res.send(err);
          User.find(function(err, users) {
            if (err){
              return err;
            }else{
              return res.json(users);
            }
          });
        });
    });

  // Settings section
  // ----------------------------------------------------
  apiRouter.route('/settings')
    .get(function(req, res) {
      var response = {};
      function countMeals(){
        return Meal.count({},function(err, data) {
                  if (err){
                    return err;
                  }else{
                    response.mealsInDB = data;
                  }
                });
      }
      function countUsers(){
        return User.count({},function(err, data) {
                  if (err){
                    return err;
                  }else{
                    response.usersInDB = data;
                  }
                });
      }
      function countBooks(){
        return Book.count({},function(err, data) {
                  if (err){
                    return err;
                  }else{
                    response.booksInDB = data;
                  }
                });
      }
      function countSports(){
        return Sport.count({},function(err, data) {
                  if (err){
                    return err;
                  }else{
                    response.matchesInDB = data;
                  }
                });
      }
      Promise.all([countMeals(), countUsers(), countBooks(), countSports()]).then(function(){
        response.lastMealsDate = minimumMealsDay;
        res.json(response);
      });
    })
    .delete(function(req,res){
      var collection = req.query.chosen;
      if(collection=='User'){
        User.remove({},function(err,data){
          if(err){
            return err;
          }else{
            res.json(data);
          }
        });
      }else if(collection == 'Meal'){
        Meal.remove({},function(err,data){
          if(err){
            return err;
          }else{
            res.json(data);
          }
        });
      }else if(collection == 'Book'){
        Book.remove({},function(err,data){
          if(err){
            return err;
          }else{
            res.json(data);
          }
        });
      }else if(collection == 'LastDate'){
        minimumMealsDay = new Date('01/01/2000');
      }else if(collection == 'Sport'){
        Sport.remove({},function(err,data){
          if(err){
            return err;
          }else{
            res.json(data);
          }
        });
      }else{
        res.json('error');
      }
    });

  // Books section
  // ----------------------------------------------------
  apiRouter.route('/books')
    .post(function(req,res){
      var book = new Book();
      book.numero = req.body.numero;
      book.letra = req.body.letra;
      book.apellidos = req.body.apellido;
      book.nombre = req.body.nombre;
      book.titulo = req.body.titulo;
      book.idioma = req.body.idioma;
      book.lugar = req.body.lugar;
      book.fullAuthor = req.body.nombre + ' ' + req.body.apellido;
      book.save(function(err){
        if(err){
          if (err.code == 11000) 
            return res.json({ success: false, message: 'Ya existe ese usuario'});
          else 
            return res.send(err);
        }
        // return a message
        res.json({ message: 'Libro creado' });
      })
    })

    .get(function(req, res) {
      var exp = req.query.search;
      var currentPage = req.query.page-1;
      Book.find( { $or: [
                    {"titulo":    { "$regex": exp, "$options": "i" }}, 
                    {"fullAuthor":    { "$regex": exp, "$options": "i" }}, 
                  ]},function(err, books) {
        if (err){
          return err;
        }else{
          Book.find({ $or: [
                      {"titulo":    { "$regex": exp, "$options": "i" }}, 
                      {"fullAuthor":    { "$regex": exp, "$options": "i" }}, 
                    ]}).count().exec(function (err,count) {
                    var nump = Math.ceil(count/10);
                    return res.json({books,nump});
          })
        }
      }).sort({numero: -1}).skip(currentPage*10).limit(10); //Remove use of SKIP, see $lt
    });

  apiRouter.route('/books/:book_id')
    .delete(function(req, res) {
      Book.remove({
        _id: req.params.book_id
      },function(err, book) {
          if (err) res.send(err);
          Book.find(function(err, books) {
            if (err){
              return err;
            }else{
              return res.json(books);
            }
          });
        });
    })
    .put(function(req, res) {
      Book.findOneAndUpdate({_id: req.params.book_id},{
        numero: req.body.numero,
        letra: req.body.letra,
        apellidos: req.body.apellidos,
        nombre: req.body.nombre,
        titulo: req.body.titulo,
        idioma: req.body.idioma,
        lugar: req.body.lugar,
        fullAuthor: req.body.nombre + ' ' + req.body.apellido,
      },function(err, data) {
        if (err){
          return err;
        }else{
          return res.json(data);
        }
      });
    })
    .get(function(req, res) {
      Book.findById({_id: req.params.book_id},function(err, data) {
        if (err){
          return err;
        }else{
          return res.json(data);
        }
      });
    });


  apiRouter.route('/booksData')
    .get(function(req, res) {
      var query = {};
      query[req.query.field] = { "$regex": "^" + req.query.search, "$options": "i" };
      Book.distinct(req.query.field,query,function(err, data) {
        if (err){
          return err;
        }else{
          return res.json(data);
        }
      });
    });

  apiRouter.route('/booksTaken')
    .get(function(req, res) {
      var currentPage = req.query.page-1;
      Book.find({enUso: {$ne:null}},function(err, books) {
        if (err){
          return err;
        }else{
          Book.find({enUso: {$ne:null}}).count().exec(function (err,count) {
            var nump = Math.ceil(count/10);
            return res.json({books,nump});
          })  
        }
      }).sort({numero: -1}).skip(currentPage*10).limit(10);
    });

  apiRouter.route('/myBooks')
    .get(function(req, res) {
      Book.find({enUso:req.query.idNum},function(err, books) {
        if (err){
          return err;
        }else{
          return res.json(books);
        }
      });
    })

    .put(function(req, res) {
      Book.findOneAndUpdate({ _id: req.body.params.MongoID },{enUso: req.body.params.idNum, fecha: new Date()},function(err, books) {
        if (err){
          return err;
        }else{
          return res.json(books);
        }
      });
    });

  // Sports section
  // ----------------------------------------------------
  apiRouter.route('/sports')
    .post(function(req,res){
      var sport = new Sport();
      sport.name = req.body.name;
      sport.place = req.body.place;
      sport.playersPerTeam = req.body.playersPerTeam;
      sport.numberOfTeams = req.body.numberOfTeams;
      sport.date = req.body.date;
      sport.startTime = req.body.startTime;
      sport.endTime = req.body.endTime;
      sport.isLocked = req.body.isLocked;
      sport.playersList = req.body.playersList;
      sport.waitingList = req.body.waitingList;
      sport.save(function(err){
        if(err){
          if (err.code == 11000) 
            return res.json({ success: false, message: 'Ya existe ese partido'});
          else 
            return res.send(err);
        }
        // return a message
        res.json({ message: 'Partido creado' });
      })
    })

    .get(function(req, res) {
      var currentPage = req.query.page-1;
      Sport.find({
        date: {$gte : new Date(new Date().setDate(new Date().getDate()-2))}
      },function(err, matches) {
        if (err){
          return err;
        }else{
          Sport.find().count().exec(function (err,count) {
                    var nump = Math.ceil(count/10);
                    return res.json({matches,nump});
          })
        }
      }).sort({date: -1}).skip(currentPage*10).limit(10); //Remove use of SKIP, see $lt
    });

  apiRouter.route('/sports/:sport_id')
    .delete(function(req, res) {
      Sport.remove({
        _id: req.params.sport_id
      },function(err, book) {
          if (err) return res.send(err);
          Sport.find(function(err, matches) {
            if (err){
              return err;
            }else{
              return res.json(matches);
            }
          });
        });
    })
    .put(function(req, res) {
      Sport.findOneAndUpdate({_id: req.params.sport_id},{
      name: req.body.name,
      place: req.body.place,
      playersPerTeam: req.body.playersPerTeam,
      numberOfTeams: req.body.numberOfTeams,
      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      isLocked: req.body.isLocked,
      playersList: req.body.playersList,
      waitingList: req.body.waitingList,
      },function(err, data) {
        if (err){
          return err;
        }else{
          return res.json(data);
        }
      });
    })
    .get(function(req, res) {
      Sport.findById({_id: req.params.sport_id},function(err, data) {
        if (err){
          return err;
        }else{
          return res.json(data);
        }
      });
    });

  apiRouter.route('/sportsData')
    .get(function(req, res) {
      var query = {};
      query[req.query.field] = { "$regex": "^" + req.query.search, "$options": "i" };
      Sport.distinct(req.query.field,query,function(err, data) {
        if (err){
          return err;
        }else{
          return res.json(data);
        }
      });
    });

    // test route to make sure everything is working 
  apiRouter.get('/', function(req, res) {
    res.json({ message: 'Bienvenido a la API!' }); 
  });


  return apiRouter;
};