const { User } = require('../models/db');

// users#index
exports.index = function(req, res) {
    (async function() {
        const users = await User.findAll();
        res.status(200).json(users);
    })();
};

// users#show
exports.show = function(req, res) {
    // Find by user ID
    (async function() {
        const user = await User.findAll({ where: { 
            id: req.params.id
        } })[0];
        res.status(200).json(user);
    })();
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
    (async function() {
        const user = await User.findAll({ where: { 
            id: req.params.id
        } })[0];

        const disabledUser = user.update({ is_disabled: 1 });
        console.log(disabledUser);
        res.send('ok');
    })();
};
