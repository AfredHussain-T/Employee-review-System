const express = require('express');
const port = 1004;
const app = express();
const Layouts = require('express-ejs-layouts');
const mongoDB = require('./configs/mongoose');

const route = require('./routes/indexRoutes');
const cookieParser = require('cookie-parser');

// Importing Express Session
const expSession = require('express-session');
const passport = require('passport');
const localPassport = require('./configs/passport_local');
// Importing Mongo Store
const mongoStore = require('connect-mongo');



// middlewares
app.use(Layouts);
app.use(express.urlencoded());
app.use(express.static('./assets'));
app.use(cookieParser());


// Setting up view engine
app.set('view engine' ,'ejs');
app.set('views' , './views');
app.set('layout extractStyles' , true);
app.set('layout extractScripts', true);

app.use(expSession({
    name: 'EmployeeReviewSystem',
    secret: 'ThisIsAFeedbackApp',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge : 1000000, 
    },
    // Storing the cookie data in mongo db
    store: mongoStore.create({
        mongoUrl: "mongodb://127.0.0.1:27017/emp-rev-system",
        autoRemove: 'disabled'
    }, function(err){
        console.log(err, 'We have this error')
    })
    
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser); 

app.use('/', route);

app.listen(port, function(err){
    if(err){
        console.log('Error while connecting to the port ', err);
        return;
    }

    console.log('The connection has been established on port :', port);
});