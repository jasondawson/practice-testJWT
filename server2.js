// dependencies
var express = require('express');
var session = require('express-session');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var axios = require('axios');
var config = require('./config.js');

var port = process.env.PORT || 8081;
var authenticationRedirectUrl = 'http://localhost:8080/#/login';

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(session({
  secret: config.sessionSecret,
  saveUninitialized: true,
  resave: true
}));


app.use(express.static(__dirname + '/public2'));

// request token
// app.get('/usertoken', function(req, res) {
//   res.send('Server 2 usertoken: ' + req.session.token);
// });

app.get('/api/getToken/:app/:state', function(req, res) {
  // page to redirect back to after authentication is on req.params.dest
  var dest = JSON.stringify(req.params.app+ '/'+ req.params.state);
  console.log('Get Token');
  if (req.session.jwToken) {
    return res.status(200).json(req.session.jwToken);
  }
  if (!req.session.jwToken) {
    console.log('---------------')
    console.log(req.session);
    // TODO redirect to server1;
     res.status(200).json({redirect: true, redirectUrl: authenticationRedirectUrl + '?bounce=' + dest})
    console.log('redirecting');
    } else {
      res.status(200).json(req.session.jwtToken);
    }

app.get('api/getToken/callback/:dest', function(req, res) {
  var dest = req.params.dest;
  res.redirect('http:/localhost:8081/#/' + dest)
})

  // axios.post('http://localhost:8080/api/authenticate', req.body).then(
  //     function(response) {
  //       if(response.data.success) {
  //         currentUser.token = response.data.token;
  //       } else {
  //         res.status(403).end()
  //       }
  //       console.log(response);
  //       res.status(200).send(response.data);
  // })
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

app.get('/redirect', function(req, res) {
  console.log(req.session);
  res.redirect('/#/');
})

// spin up server
app.listen(port, function() {
  console.log('Server 2 Functional on port ' + port);
})



//userid, name, roles
