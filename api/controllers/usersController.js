const ErrorHandler = require('../utils/errorHandler');
const asyncErrors = require('../middlewares/asyncErrors');
const { User } = require('../models/db');

// users#index
exports.index = function(req, res) {
    (async function() {
        const users = await User.findAll();
        res.status(200).json({
            success: true,
            data: users
        });
    })();
};

// users#show
exports.show = asyncErrors (async function(req, res, next) {
    // Find by user ID
    const user = await User.findAll({ where: { 
        id: req.params.id
    } })[0];
    res.status(200).json({
        success: true,
        data: user
    });
});

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
        res.json({
            success: true,
            message: 'user created',
            data: newUser
        });
    });
};

// users#update
exports.update = async function(req, res, next) {

    const user = User.findAll({ where: { 
        id: req.params.id
    }})[0];

    const hashed = hash(req.body.password);

    const newUserDetails = {
        username: req.body.username,
        email: req.body.email,
        password: hashed
    };

    user.update(newUserDetails).then(() => res.send('ok'));
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
