// const mysql = require('mysql2');
const { Sequelize } = require('sequelize');

/** connect to database */
const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'mysql',
  dialectOptions: {
    // Your mysql2 options here
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE
  }
})

  // ensure db is connected
  // await sequelize.authenticate(); // wait until the promise resolves (*)
  // console.log('Connection has been established successfully.');
  
const User = require(`./user`)(sequelize);
const Project = require(`./project`)(sequelize);
const UserGroup = require(`./userGroup`)(sequelize);

User.hasMany(UserGroup, { foreignKey: 'user_id'} )
UserGroup.belongsTo(User, { foreignKey: 'user_id'} )

module.exports = {
  User,
  Project,
  UserGroup
};


  