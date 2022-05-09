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
const UserGroup = require(`./userGroup`)(sequelize);
const Project = require(`./project`)(sequelize);

// (async function() {
//   await sequelize.sync({ force: true })
// })()

User.hasMany(UserGroup, { foreignKey: 'user_id'} )
UserGroup.belongsTo(User, { foreignKey: 'user_id'} )

Project.hasMany(UserGroup,  { foreignKey: 'app_Acronym'} )
UserGroup.belongsTo(Project, { foreignKey: 'app_Acronym'} )

User.belongsToMany(Project, { through: UserGroup, foreignKey: 'user_id'})
Project.belongsToMany(User, { through: UserGroup, foreignKey: 'app_Acronym'})


module.exports = {
  User,
  Project,
  UserGroup
};


  