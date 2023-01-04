const DataTypes = require('sequelize')
const db = require('../../database/db.js')

module.exports = db.sequelize.define(
  'payment_method',
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },

    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    paymentReference: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    paymentObj: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    order: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    method: {
      type: DataTypes.STRING(7),
      allowNull: false
    },
    gateway: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    token: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },  
 }, 
    {
      timestamps: false,
      tableName: 'payment_method'
    }
)