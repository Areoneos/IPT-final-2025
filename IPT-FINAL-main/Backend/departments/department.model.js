module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 100]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [10, 1000]
      }
    }
  });

  return Department;
}; 