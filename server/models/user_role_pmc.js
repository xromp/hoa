const DataTypes = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'user_role_pmcs',
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_role_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'user_role',
        key: 'id'
      }
    },
    pmc_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'pmc',
        key: 'id'
      }
    },
    user_role_permission_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'user_role_permission',
        key: 'id'
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },  
  {
    timestamps: false,
    tableName: 'user_role_pmcs'
  }
)