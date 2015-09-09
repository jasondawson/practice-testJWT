var User = require('../models/user.js');

module.exports ={

  create: function(req, res) {
    User.findOne({ email: req.body.email}).exec(function(err, user){
      if(err) { return res.status(500).send(err); }
      if(user) { return res.status(500).send('User already exists')}
      var newUser = new User(req.body);
      newUser.save(function(err, user) {
        return res.status(200).json(user);
      })

    })
  }
  //end create

}
