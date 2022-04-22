var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');

exports.index = function(req, res) {
  User.findAll()
  .then(users => res.status(200).json(users));
};