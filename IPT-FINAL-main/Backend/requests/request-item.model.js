module.exports = (sequelize, DataTypes) => {
  const RequestItem = sequelize.define('RequestItem', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1
      }
    },
    requestId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'RequestItem',
    underscored: true
  });

  RequestItem.associate = (models) => {
    RequestItem.belongsTo(models.Request, {
      foreignKey: 'requestId',
      as: 'request'
    });
  };

  return RequestItem;
}; 