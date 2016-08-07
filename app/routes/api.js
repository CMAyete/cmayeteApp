// Load packages
// ================

var Meal       = require('../models/meals');
var User       = require('../models/users');
var Book       = require('../models/books');
var jwt        = require('jsonwebtoken');
var config     = require('../config/config');

// keys and data
// ================
var secret    = process.env.SECRET || config.secret;
var normalkey    = process.env.NORMALKEY || config.normalkey;
var minimumMealsDay = process.env.MINDAY || new Date().setTime(config.minday);
var defaultUserMail = process.env.DEFAULTUSER || config.defaultUser;


// API Code
// =========
module.exports = function(app, express, passport) {

  var apiRouter = express.Router();


  apiRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile','email'] }));
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
                                  },
                                  secret,{
                                    expiresIn: 11520 // expires in 8 days
                                  });

            res.cookie('cmayete', token);
            res.redirect('/meals');  
          }else{
            res.redirect('/login');
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
          res.status(403).send({ 
            success: false, 
            message: 'Auth error.', 
        });      
        } else { 
          req.decoded = decoded;
          User.findOne({'email':req.decoded.email},function(err,userfound){
          if(userfound || req.decoded.email == defaultUserMail){
            next();
          }else{
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
      meal.save(function(err) {
        if (err) {
          // duplicate entry
          if (err.code == 11000) 
            return res.json({ success: false, message: 'Esa comida ya está pedida'});
          else 
            return res.send(err);
        }
        res.json({ message: 'Cambio registrado!' });
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
        date: req.params.meal_date
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

  apiRouter.route('/lastdate')

  // update the date with this id
  .put(function(req, res) {
        minimumMealsDay = new Date();
        //process.env.MINDAY = minimumMealsDay;
        //console.log(MINDAY);
        // return a message
        res.json(minimumMealsDay);
  })  

  .get(function(req, res) {
    return res.json(minimumMealsDay);
  });

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
      User.find(function(err, users) {
        if (err){
          return err;
        }else{
          return res.json(users);
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
                    {"nombre":    { "$regex": exp, "$options": "i" }}, 
                    {"apellidos": { "$regex": exp, "$options": "i" }}
                  ]},function(err, books) {
        if (err){
          return err;
        }else{
          Book.find({ $or: [
                      {"titulo":    { "$regex": exp, "$options": "i" }}, 
                      {"nombre":    { "$regex": exp, "$options": "i" }}, 
                      {"apellidos": { "$regex": exp, "$options": "i" }}
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
        apellidos: req.body.apellido,
        nombre: req.body.nombre,
        titulo: req.body.titulo,
        idioma: req.body.idioma,
        lugar: req.body.lugar,
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


    // test route to make sure everything is working 
  apiRouter.get('/', function(req, res) {
    res.json({ message: 'Bienvenido a la API!' }); 
  });


  return apiRouter;
};