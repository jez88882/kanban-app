const { DataTypes } = require('sequelize');

module.exports = function(sequelize) {
  const Application = sequelize.define('Application', {
    App_Rnumber: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    App_Acronym: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    App_Description: {
      type: DataTypes.TEXT,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    App_permit_Create: {
      type: DataTypes.STRING,
    },
    App_permit_Open: {
      type: DataTypes.STRING,
    },
    App_permit_toDoList: {
      type: DataTypes.STRING,
    },
    App_permit_Doing: {
      type: DataTypes.STRING,
    },
    App_permit_Done: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'applications'
  });
  return Application;
}  

