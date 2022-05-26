const { DataTypes } = require('sequelize');

module.exports = function(sequelize) {
  const UserGroup = sequelize.define('UserGroup', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true
    },  
    group: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'usergroups'
  });
  
  return UserGroup;
}
