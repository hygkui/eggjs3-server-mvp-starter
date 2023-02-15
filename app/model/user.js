'use strict';

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const User = app.model.define('users', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    userName: {
      type: STRING,
      allowNull: false,
      unique: true,
      comment: '用户名，唯一',
    },
    passWord: STRING,
  });

  return User;
};
