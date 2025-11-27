'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Contribution, {
        foreignKey: 'user_id',
        as: 'contributions'
      });
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [3, 30]
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
    paranoid: true
  });
  return User;
};