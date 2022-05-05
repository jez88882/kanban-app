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
    user_id: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'user_groups'
  });
  
  return UserGroup;
}
