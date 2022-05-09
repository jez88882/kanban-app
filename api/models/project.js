const { Sequelize, DataTypes } = require('sequelize');

module.exports = function(sequelize) {
  const Project = sequelize.define('Project', {
    app_Rnumber: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    app_Acronym: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    app_Description: {
      type: DataTypes.TEXT,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    tableName: 'applications'
  });
  return Project;
}  

