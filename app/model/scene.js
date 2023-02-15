'use strict';
module.exports = app => {
  return app.model.define('scene', {
    id: { field: 'id', type: app.Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { field: 'name', type: app.Sequelize.STRING, allowNull: false },
    type: { field: 'type', type: app.Sequelize.STRING },
    content: { field: 'content', type: app.Sequelize.TEXT },
    parentId: { field: 'parent_id', type: app.Sequelize.INTEGER },
    userId: { field: 'user_id', type: app.Sequelize.INTEGER },
    createTime: { field: 'create_time', type: app.Sequelize.DATE },
    updateTime: { field: 'update_time', type: app.Sequelize.DATE },
  }, {
    timestamps: true,
    tableName: 'tb_scene',
    createdAt: 'createTime',
    updatedAt: 'updateTime',
  });
};

