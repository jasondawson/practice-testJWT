var express = require('express');
var session = require('express-session');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('./config');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var microserviceLookup = require('./microserviceLookup.js');

// Mongoose models
var User = require('./api/models/user');

// controllers
var UserCtrl = require('./api/controllers/userController.js')


var corsOptions = {
  origin: 'localhost:8081'
};



app.use(cors(corsOptions));
app.use(express.static(__dirname + '/public'));

passport.use(new LocalStrategy({
  usernameField: 'email'
}, function(username, password, done){
  User.findOne({ email: email}, function(err, user) {
    if(err) {return done(err); }
    if(!user) {return done(null, false); }
    if(!user.verifyPassword(password)) { return done(null, false); }
    return done(null, user);
  })
}));

passport.serializeUser(function(user, done) {
  done(null, user._id);
})

passport.deserializeUser(function(id, done) {
  User.findOneById(id).exec(function(err, user) {
    if (err) { return done(err); }
    done(null, user);
  })
})

app.use(express.static(__dirname + '/public'));
app.use(session({
  secret: config.sessionSecret,
  saveUninitialized: true,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

var port = process.env.PORT || 8080;

var checkToken = function(req, res, next) {

  // check header or url/post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verify secret and checks expiration
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.'});
        } else {
          //if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
    });
  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
};


app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));

//routes
app.get('/', function(req, res) {
  res.send('Hello! The API is at http://localhost:' + port + '/api');
});

app.get('/setup', function(req, res) {
  var nick = new User({
    name: 'Not Nick',
    password: 'weakpasswordNick',
    admin: true
  });
  nick.save(function(err){
    if (err) throw err;

    console.log('User saved successfully');
    res.json({success: true});
  });
});


// API Routes ---------------------

var apiRoutes = express.Router();

//route to show a message
apiRoutes.get('/', checkToken, function(req, res) {
  console.log(req.decoded);
  res.json({ message: 'Welcome to the coolest API on Earth' });
});

//route to return all users
apiRoutes.get('/users', checkToken, function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  })
})

apiRoutes.post('/authenticate', function(req, res) {
  if (req.query['bounce']) {
    var parsedBounceArr = req.query.bounce.split('/')
    console.log(parsedBounceArr);
    var bounceHost = microserviceLookup[parsedBounceArr[0]] + parsedBounceArr[1];
    console.log(bounceHost);
    req.session.bounceTo = req.query.bounce
    console.log(req.query.bounce)
  }
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      return res.json({ success: false, message: 'Authentication failed. User not found.' })
    } else if (user) {

      // check if password matches
      user.comparePassword(req.body.password).then(function(isMatch) {
        if (isMatch) {
          var token = jwt.sign({
          email: user.email,
          _id: user._id,
          roles: user.roles
        }, app.get('superSecret'), {
          expiresInMinutes: 1440
        });
           user.jwtoken = token;
           user.save(function(err, user){
              res.status(200).json({
                success: true,
                message: 'User Authenticated.',
                jwtoken: token,
                redirect: bounceHost
                })
           })
        }
        else {
          // TODO handle not authenticating
         return res.json({ success: false, message: 'Authentication failed. Wrong Password.' })
        }
      })

    }
  });
});

apiRoutes.post('/signup', UserCtrl.create);



app.use('/api', apiRoutes);

// database connection
mongoose.connect(config.database);
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {
  console.log('connected to db');
});


app.listen(port, function(){
  console.log('Server 1 running on port ' + port);
});
