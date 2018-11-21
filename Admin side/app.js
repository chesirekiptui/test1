/**
* Module dependencies.
*/
var express = require('express')
  , routes = require('./routes')
  , admin = require('./routes/admin')
  , http = require('http')
  , path = require('path');
  var methodOverride = require('method-override')

const morgan = require('morgan')
var session = require('express-session');
var app = express();
var mysql      = require('mysql');
var bodyParser=require("body-parser");
var connection = mysql.createConnection({
              host     : 'localhost',
              user     : 'root',
              password : '12345678Kk',
              database : 'transcript'
            });

connection.connect((err) =>{
  if(!err){
    console.log("Connection to the database is successful!");
  }else{
    console.log("Database connection failed");
  }

});


global.db = connection;

// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(morgan('combined'))
app.use(express.json());
app.use(methodOverride());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
              secret: 'keyboard cat',
              resave: false,
              saveUninitialized: true,
              cookie: { maxAge: 1000000 }
            }))

// development only


app.get('/', routes.index);//call for main index page
app.get('/signup', admin.signup);//call for signup page
app.post('/signup', admin.signup);//call for signup post
app.get('/login', routes.index);//call for login page
app.post('/login', admin.login);//call for login post
app.get('/home/dashboard', admin.dashboard);//call for dashboard page after login
app.get('/home/logout', admin.logout);//call for logout
app.get('/home/profile',admin.profile);//to render users profile
app.get('/home/manageusers', admin.list);//dispay a list of all users
app.get('/home/adduser', admin.adduser);//add a new user
app.post('/home/adduser', admin.adduser);
app.get('/home/delete/(:id)', admin.delete_user);
app.get('/home/edit/(:id)', admin.edit);
app.post('/home/edit/(:id)',admin.save_edit);
app.get('/home/viewtranscripts',admin.viewtranscripts);//to render viewtranscripts


//Middleware
app.listen(5000, () => {
  console.log(`Server running on port 5000 `);
});
