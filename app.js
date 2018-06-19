const express = require('express');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const auth = require('./auth.js');
const bodyParser = require('body-parser');
const port = process.env.port || 3000;
const path = require('path');

//set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'some-secret',
  saveUninitialized: false,
  resave: true
}));

// For parsing post request's data/body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// Tells app to use password session
app.use(auth.initialize());
app.use(auth.session());

app.use(flash());

//sets up the inital route
app.get('/', function (req, res) {
  if (req.user) {
    res.render('profile', {
      //passes the password to be rendered by ej
      username: req.user.username
    });
  } else {
    res.render('index');
  }
});

//renders the login screen
app.get('/login', function (req, res) {
  res.render('login');
});

//logs out the user when they ask to logout
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

//set up the auth to authenticate given the paths
app.post('/login',
  auth.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

//starts the server on the specified port
app.listen(port, () => {
  console.log(`serving on port ${port}`);
});
