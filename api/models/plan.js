const { DataTypes } = require('sequelize');

module.exports = function(sequelize) {
  const Plan = sequelize.define('Plan', {
    Plan_MVP_name: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    Plan_startDate: {
      type: DataTypes.DATEONLY,
    },
    Plan_endDate: {
      type: DataTypes.DATEONLY,
    },
    Plan_app_Acronym: {
      type: DataTypes.STRING,
      allowNull: false
    },
    closed: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
  }, {
    tableName: 'plans'
  });
  return Plan;
}  

