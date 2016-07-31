var config     = require('./config');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
module.exports = function(passport){

	passport.use(new GoogleStrategy({
	    clientID: config.googleAuth.clientID,
	    clientSecret: config.googleAuth.clientSecret,
	    callbackURL: "http://127.0.0.1:8080/api/auth/google/callback"
	  },
	  function(accessToken, refreshToken, profile, done) {
	    return done(null, profile.emails[0].value);
	  }
	));

}
