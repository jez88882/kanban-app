/** connect to database */
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
async function connect() {
  await sequelize.authenticate(); // wait until the promise resolves (*)
  console.log('Connection has been established successfully.');
}
connect();

const User = require(`./user`)(sequelize);
console.log("loaded User model");
/**
const Project = require(`./project`)(sequelize);
console.log("loaded Project model");
*/

module.exports = {
  User
  // Project
};
