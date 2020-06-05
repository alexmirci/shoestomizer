const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const User = require('./models/user')


function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        const user2 = getUserByEmail(email)
        var user = (await User.findOne({email:email}))
        if (user == null) {
            return done(null, false, { message: 'There is no user with that password. Please try again'})
        };
        user = user.toJSON()

        try {
            if ( await bcrypt.compare(password,user.password)) {
                return done(null,user)

            } else {
                return done(null, false, {message: "Wrong password! Please try again."})
            }
        } catch (e) {
            return done(e)
        }
    }

    passport.use(new LocalStrategy({usernameField: 'email'},authenticateUser))

    passport.serializeUser(function(user, done) {
        done(null, user);
      });
      
      passport.deserializeUser(function(user, done) {
        done(null, user);
      });

    

}



module.exports = initialize