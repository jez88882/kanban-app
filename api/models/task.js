const { DataTypes } = require('sequelize');

module.exports = function(sequelize) {
  const Task = sequelize.define('Task', {
    Task_name: {
      type: DataTypes.STRING,
    },
    Task_description: {
      type: DataTypes.STRING,
    },
    Task_notes: {
      type: DataTypes.TEXT,
    },
    Task_id: {
      primaryKey: true,
      type: DataTypes.STRING,
      allowNull: false
    },
    Task_plan: {
      type: DataTypes.STRING,
      // allowNull: false
    },
    Task_state: {
      type: DataTypes.STRING,
      // allowNull: false
    },
    Task_creator: {
      type: DataTypes.STRING,
      // allowNull: false
    },
    Task_owner: {
      type: DataTypes.STRING,
      // allowNull: false
    },
    Task_createDate: {
      type: DataTypes.DATE,
      // allowNull: false
    },
  }, {
    tableName: 'tasks'
  });
  return Task;
}  

