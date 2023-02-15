module.exports = app => {
  console.log('🚀 ~ file: app.js ~ line 3 ~ app.config', app.config.env);
  if (app.config.env === 'local' || app.config.env === 'dev') {
    app.beforeStart(async () => {
      await app.model.sync({ force: true });
    });
  }
};

// 周期函数读取
class AppBootHook {
  constructor(app) {
    this.app = app;
    const env = app.config.env;
    console.log(`\n\n\n 🚀 ~ file: app.js ~ line 15 ~ AppBootHook ~ constructor ~ env: ${env}\n\n\n`);
    app.beforeStart(async () => {
      if (env === 'unittest') { // 单元测试环境
        await app.model.sync({ force: true });
      } else if ([ 'local', 'dev' ].includes(env)) { // 本地开发环境
        await app.model.sync({ force: true }); // 会删除表，慎用
        // await app.model.sync({ alter: true }); // 会修改表，慎用
      }
    });
  }
  configWillLoad() {
    // 此时 config 文件已经被读取并合并，但是还并未生效
    // 这是应用层修改配置的最后时机
    // 注意：此函数只支持同步调用

    // 例如：参数中的密码是加密的，在此处进行解密
    // 例如：插入一个中间件到框架的 coreMiddleware 之间
  }

  async didLoad() {
    // 所有的配置已经加载完毕
    // 可以用来加载应用自定义的文件，启动自定义的服务

    // 例如：创建自定义应用的示例
    // 例如：加载自定义的目录
  }

  async willReady() {
    // 所有的插件都已启动完毕，但是应用整体还未 ready
    // 可以做一些数据初始化等操作，这些操作成功才会启动应用
    console.log('this.app :>>  will ready');
  }

  async didReady() {
    // 应用已经启动完毕
  }

  async serverDidReady() {
    // http / https server 已启动，开始接受外部请求
    // 此时可以从 app.server 拿到 server 的实例
    const ctx = await this.app.createAnonymousContext();
    console.log('this.app, ctx :>> serverDidReady', typeof ctx);
  }
}
module.exports = AppBootHook;
