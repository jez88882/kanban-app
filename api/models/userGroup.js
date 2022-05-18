const { DataTypes } = require('sequelize');

module.exports = function(sequelize) {
  const UserGroup = sequelize.define('UserGroup', {
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
