var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var q = require('q');

var schema = mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    roles: [{type: String, enum: ['student', 'admin']}],
    jwtoken: String
})

schema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(12, function(err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, function(err, hash) {
      console.log(user.password);
      user.password = hash;
      return next();
    });
  });
});

schema.methods.comparePassword = function (pass) {
  var user = this;
  console.log(user);
  var dfd = q.defer();
  console.log(pass)
  bcrypt.compare(pass, user.password, function(err, isMatch) {
    if (err) {
      dfd.reject(err);
    }
    else {
      dfd.resolve(isMatch);
    }
  });
  return dfd.promise;
};

module.exports = mongoose.model('User', schema);
