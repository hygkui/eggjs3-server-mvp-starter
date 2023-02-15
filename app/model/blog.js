'use strict';
module.exports = app => {
  return app.model.define('blog', {
    id: { field: 'id', type: app.Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: { field: 'title', type: app.Sequelize.STRING, allowNull: false },
    author: { field: 'author', type: app.Sequelize.STRING },
    cover: { field: 'cover', type: app.Sequelize.STRING },
    content: { field: 'content', type: app.Sequelize.TEXT },
    createTime: { field: 'create_time', type: app.Sequelize.DATE },
    updateTime: { field: 'update_time', type: app.Sequelize.DATE },
  }, {
    timestamps: true,
    tableName: 'tb_blog1',
    createdAt: 'createTime',
    updatedAt: 'updateTime',
  });
};

