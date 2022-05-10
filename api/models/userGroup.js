const { DataTypes } = require('sequelize');

module.exports = function(sequelize) {
  const UserGroup = sequelize.define('UserGroup', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true    
    },
    name: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.INTEGER,
    },
    app_Acronym: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'user_groups'
  });
  
  return UserGroup;
}
