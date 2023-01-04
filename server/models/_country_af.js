/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('country_af', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    country_master_id: {
      type: DataTypes.INTEGER(11)
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    code: {
      type: DataTypes.CHAR(2),
      allowNull: false
    }
  }, {
    tableName: 'country_af'
  });
};
