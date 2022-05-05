const { Sequelize, DataTypes } = require('sequelize');

module.exports = function(sequelize) {
  const Project = sequelize.define('Project', {
    app_Rnumber: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    app_acronym: {
      type: DataTypes.STRING,
      allowNull: false
    },
    app_description: {
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
    tableName: 'projects'
  });
  return Project;
}  

