
const { Controller } = require('egg');

// 校验用户注册参数
const vUser = {
  userName: { type: 'string', required: true },
  passWord: { type: 'string', required: true },
};

class UserController extends Controller {
  // 用户注册
  async rigist() {
    const { ctx } = this;
    // 接收并校验参数
    ctx.validate(vUser, ctx.request.body);
    // 判断用户名是否重复
    const users = await ctx.service.user.checkUserName(ctx.request.body);
    if (users[0]) {
      ctx.body = { status: false, msg: '用户名已存在', data: users };
      return;
    }
    await ctx.service.user.Rigist(ctx.request.body);
    ctx.body = { status: true, msg: '注册成功' };
  }

  // 用户登陆
  async login() {
    const { ctx } = this;
    // 接收并校验参数
    ctx.validate(vUser, ctx.request.body);
    const data = await ctx.service.user.Login(ctx.request.body);
    if (!data) {
      ctx.status = 401;
      ctx.body = { status: false, msg: '用户名或密码错误' };
      return;
    }
    ctx.body = { status: true, msg: '登陆成功', data };
  }
}

module.exports = UserController;

