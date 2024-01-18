'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/api/system', controller.home.system);
  router.get('/', controller.home.system);
  router.post('/api/upload', controller.file.upload); // 上传文件
   // 地址级联查询
   router.get('/api/provinces', controller.home.getProvince); // 获取省份
   router.get('/api/cities', controller.home.getCity); // 获取城市
   router.get('/api/counties', controller.home.getCounty); // 获取区县

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
