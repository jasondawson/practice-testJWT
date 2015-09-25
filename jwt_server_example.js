var express = require('express');
var session = require('express-session');
var cors = require('cors');
var bodyParser = require('body-parser');
var config = require('./config.js');

// morgan is for development - logs requests to the server in the terminal
var morgan = require('morgan');

//axios could be used for api requests from devmountain's api if needed.
//var axios = require('axios');

var app = express();
var port = process.env.PORT || 8082;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(session({
  secret: config.sessionSecret,
  saveUninitialized: true;
  resave: true
}));

app.use(express.static(__dirname + '/public'));

//***********************************//
//authentication specific stuff starts here
//***********************************//

var jwt = require('jsonwebtoken');
// app name and client token should be given to you
var app_name = '' // your app name here
var client_token = '' // your client token here
var authenticationRedirectUrl = 'http://devmounta.in/login/?bounce=' + app_name + '&token=' + client_token;


// authentication endpoint will look like
// /auth/getToken/:state
var authRoutes = express.Router();
app.use('/auth', authRoutes);

// allows app state or route to be passed here, saved in the session and redirected to after authentication
authRoutes.get('/getToken/:state', function(req, res) {
  req.session.redirectState = req.params.state;

  // if the decoded token is already on the session, just pass it back
  if (req.session.decoded) {
    return res.status(200).json({
      user: req.session.decoded
    });
  }

  //else if no decoded token, pass redirect info back to app (cannot redirect in xhr request, must be handled by client)
  else {
    res.status(200).json({
      redirect: true,
      location: authenticationRedirectUrl
    })

  }
});


// this is where devmountain will redirect back to. Grabs the app state for redirection to that state or route (if passed in previous get)
authRoutes.get('/ms/callback', function(req, res) {
  var token = req.query.token;

  // if passed a token, decoded it and place it on the session. The decoded object is the user that has now been authenticated.
  if (token) {
    jwt.verify(token, config.jwtSecret, function(err, decoded) {
      if (err) {
        return res.json({success: false, message: 'Failed to verify token'});
      } else {

        //token is valid
        req.session.decoded = decoded;

        var tmp = req.session.redirectState || null
        delete req.session.redirectState;
        res.redirect('/#/' + tmp);
      }
    })
  }

  //else there is no token
  return (res.status(403).json({
    success: false,
    message: 'No token given'
  }))
})

authRoutes.get('/logout', function(req, res) {
  delete req.session.decoded;
  res.status(200).send();
})
