if (process.env.NODE_ENV !=='production'){
    require('dotenv').config(); // sets env variables
}



const express = require('express'); //iti trb express pt calls
const app = express();
const bcrypt = require('bcrypt');  //bcrypt for hashing passwords
const passport = require('passport'); //for users
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const initializePassport = require('./passport-config');
const bodyParser = require ('body-parser')



initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)




const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {useUnifiedTopology:true, useNewUrlParser: true})  //using env variable
const db = mongoose.connection

db.on('error', error => console.error(error))
db.once('open', () => console.log('connected to Mongoose'))




const users=[] 

app.use("/public",express.static(__dirname + "/public")); //
app.use("/repositories",express.static(__dirname + "/repositories")); //
app.use("/styles",express.static(__dirname + "/styles")); //
app.use("/images",express.static(__dirname + "/images"));
app.use("/customizer",express.static(__dirname + "/customizer"));
app.use("/js_functional",express.static(__dirname + "/js_functional"));
app.set('view-engine','ejs')
app.use(express.urlencoded({extended:false})); //to use the forms
app.use(flash())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized:false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"))
app.use(bodyParser.urlencoded({limit:'10mb', extended: false}))


const indexRouter = require('./routes/index')
app.use('/', indexRouter)

const sneakersRouter = require('./routes/sneakers')
app.use('/', sneakersRouter)


const customizeRouter = require('./routes/customize')
app.use('/', customizeRouter)

const orderRouter = require('./routes/orders')
app.use('/', orderRouter)




const loginRouter = require('./routes/login')
app.use('/', loginRouter)


const registerRouter = require('./routes/register')
app.use('/', registerRouter)


app.post('/login',checkNotAuthenticated, passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/login',
    failureFlash:true
}))



const User = require('./models/user')

app.post('/register',checkNotAuthenticated, async (req,res)=>{
    
    try{
        const hashedPassword = await bcrypt.hash(req.body.password,10); //10 - how many times do you want it hashed? 10 makes it quick and secure.
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword    
            })
        console.log(newUser)
        newUser.save()
        res.redirect('/login');
    } catch{
        console.log('error')
        res.redirect('/register');
    }
});

app.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login')
})


function checkNotAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return res.redirect('/');
    }
    next();
}


app.listen(3000);

module.exports = app
