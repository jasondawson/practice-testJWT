var User = require('../models/user.js');

module.exports ={

  create: function(req, res) {
    User.findOne({ email: req.body.email}).exec(function(err, user){
      if(err) { return res.status(500).send(err); }
      if(user) { return res.status(500).send('User already exists')}
      var newUser = new User(req.body);
      newUser.save(function(error, theUser) {
        if(error) return res.status(error).json(error);
        if(req.session.callbackurl){
          var tempUrl = req.session.callbackurl;
          req.session.callbackurl = '';
          var token = jwt.sign({
            email: user.email,
            _id: user._id,
            roles: user.roles
          }, app.get('superSecret'), {
            expiresInMinutes: 1440
          });
          theUser.token = token;
          req.session.devMountainToken = token;
          theUser.save(function(erro, userr){
            if(erro) return res.status(500).json(erro);
            return res.redirect(tempUrl);
          })
        }
        return res.status(200).json(theUser);
      })

    })
  }
  //end create

}
