'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/api/info', controller.home.index);
  router.resources('scene', '/api/scenes', controller.scene);

  router.post('/api/user/rigist', controller.user.rigist); // 用户注册
  router.post('/api/user/login', controller.user.login); // 用户登陆

  router.post('/api/db/createDB', controller.db.createDB); // 创建数据库 不是必须的，如果没有数据库，会自动创建
  router.post('/api/db/upsertModel', controller.db.upsertModel); // 创建或更新模型
  router.post('/api/db/modelMethod', controller.db.modelMethod); // 执行查询方法
  router.get('/api/db/modelSchema', controller.db.modelSchema); // 获取模型schema

  router.post('/api/db/signup', controller.db.signup); // 用户注册
  router.post('/api/db/login', controller.db.login); // 用户登陆

  // // 在路由里添加jwt中间件 即可使用jwt鉴权
  // router.put('/api/v1/user/:id', app.jwt, controller.user.update); // 修改用户信息
};
