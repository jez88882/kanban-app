const { User } = require('../models/db');

// users#index
exports.index = function(req, res) {
    User.findAll()
    .then(users => res.status(200).json(users));
};

// users#show
exports.show = function(req, res) {
    // Find by user ID
    User.findAll({ where: { 
        id: req.params.id
    }})
    .then(users => res.status(200).json(users[0]));
};

// users#create
exports.create = function(req, res) {

    const hashed = hash(req.body.password);
    
    const userDetails = {
        username: req.body.username,
        email: req.body.email,
        password: hashed
    };

    User.create(userDetails)
    .then((newUser) => {
        console.log(newUser);
        res.send('ok');
    });
};

// users#update
exports.update = function(req, res) {

    const hashed = hash(req.body.password);

    const newUserDetails = {
        username: req.body.username,
        email: req.body.email,
        password: hashed
    };
    User.findAll({ where: { 
        id: req.params.id
    }})
    .then(users => users[0].update(newUserDetails))
    .then(() => res.send('ok'));
};

// users#disable
exports.disable = function(req, res) {
    User.findAll({ where: { 
        id: req.params.id
    }})
    .then(users => users[0].update({is_disabled: 1}))
    .then((updatedUser) => {
        console.log(updatedUser);
        res.send('ok');
    });
};
