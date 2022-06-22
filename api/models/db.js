// const mysql = require('mysql2');
const { Sequelize } = require('sequelize');

/** connect to database */
const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'mysql',
  dialectOptions: {
    // Your mysql2 options here
    host     : "host.docker.internal",
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE
  }
})

// ensure db is connected
// await sequelize.authenticate(); // wait until the promise resolves (*)
// console.log('Connection has been established successfully.');
  
const User = require(`./user`)(sequelize); 
const UserGroup = require(`./userGroup`)(sequelize);
const Application = require(`./application`)(sequelize);
const Plan = require(`./plan`)(sequelize);
const Task = require(`./task`)(sequelize);

// (async function() {
//   await sequelize.sync({ force: true })
// })()

User.hasMany(UserGroup, { foreignKey: 'username'} )
UserGroup.belongsTo(User, { foreignKey: 'username'} )


module.exports = {
  User,
  Application,
  UserGroup,
  Plan,
  Task
};


  