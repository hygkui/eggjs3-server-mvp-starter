'use strict';
module.exports = app => {
  // 项目 数据库 模型 定义
  return app.model.define(
    'projectModel',
    {
      id: {
        field: 'id',
        type: app.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: { field: 'name', type: app.Sequelize.STRING, allowNull: false },
      projectId: { field: 'project_id', type: app.Sequelize.INTEGER, allowNull: false, comment: '项目id' },
      schema: { field: 'schema', type: app.Sequelize.TEXT('medium'), comment: '数据表模型定义' },
      createTime: { field: 'create_time', type: app.Sequelize.DATE },
      updateTime: { field: 'update_time', type: app.Sequelize.DATE },
    },
    {
      timestamps: true,
      tableName: 'tb_project_model',
      createdAt: 'createTime',
      updatedAt: 'updateTime',
    }
  );
};
