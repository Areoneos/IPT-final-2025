module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['Equipment', 'Leave', 'Resources']]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Pending',
      validate: {
        isIn: [['Pending', 'Approved', 'Rejected']]
      }
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Employees',
        key: 'id'
      }
    }
  });

  Request.associate = (models) => {
    Request.belongsTo(models.Employee, {
      foreignKey: 'employeeId',
      as: 'employee'
    });
    Request.hasMany(models.RequestItem, {
      foreignKey: 'requestId',
      as: 'requestItems'
    });
  };

  return Request;
}; 