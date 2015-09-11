// dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var axios = require('axios');
var currentUser = {};

var port = process.env.PORT || 8081;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

// request token

app.get('/', function(req, res) {
  res.send('Server 2 usertoken: ' + currentUser.token);
});

app.post('/api/server2Authenticate', function(req, res) {
  console.log('Posted');
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
