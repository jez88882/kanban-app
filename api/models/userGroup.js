const { DataTypes } = require('sequelize');

module.exports = function(sequelize) {
  const UserGroup = sequelize.define('UserGroup', {
    group: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.INTEGER,
    },
    app_Acronym: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'usergroups'
  });
  
  return UserGroup;
}
