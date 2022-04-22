const { Sequelize, DataTypes } = require('sequelize');

module.exports = function(sequelize) {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "12345678"
    },
    is_disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    }
  }, {
    tableName: 'users'
  });
  User.sync({ alter: true })
  return User;
}
