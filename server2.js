// dependencies
var express = require('express');
var session = require('express-session');
var jwt = require('jsonwebtoken');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var axios = require('axios');
var currentUser = {};

var port = process.env.PORT || 8081;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
  secret: config.sessionSecret,
  saveUninitialized: true,
  resave: true
}));
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public/app'));

app.set('superSecret', config.secret);

app.get('/auth', function(req, res){
  if(req.session.devMountainToken) {
    jwt.verify(req.session.devMountainToken, app.get('superSecret'), function(err, decoded){
      if(err) return res.status(500).json(err);
      return res.json(decoded);
    });
  } else {
    res.redirect('http://localhost:8080/api/microauth?callbackurl=auth');
  };
});

// request token
app.get('/', function(req, res) {
  res.send('Server 2 usertoken: ' + currentUser.token);
});


app.post('/api/server2Authenticate', function(req, res) {
  console.log('Posted');
  console.log(3333, req.body)
  axios.post('http://localhost:8080/api/authenticate', req.body).then(
      function(response) {
        if(response.data.success) {
          currentUser.token = response.data.token;
        } else {
          res.status(403).end()
        }
        console.log(response);
        res.status(200).send(response.data);
  })
}
);


// try to use token


app.get('/api/usersThroughServer2', function(req, res){
    axios.get('http://localhost:8080/api/users', {
      params: {
        token: currentUser.token
      }
    }).then(function(response) {
        console.log(response);
        res.send(response.data);
    })
})

// spin up server
app.listen(port, function() {
  console.log('Server 2 Functional on port ' + port);
})



//userid, name, roles
