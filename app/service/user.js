const bcrypt = require('bcryptjs');

const { Service } = require('egg');

class UserService extends Service {

  // 检查用户名
  async checkUserName(query) {
    const { userName } = query;
    const users = await this.ctx.model.User.findAll({
      attributes: [ 'userName' ],
      where: { userName },
    });
    return users;
  }


  // 用户注册
  async Rigist(body) {
    const { userName, passWord } = body;
    // 对密码加密
    const hash = bcrypt.hashSync(passWord, this.config.bcrypt.saltRounds);
    const user = await this.ctx.model.User.create({ userName, passWord: hash });
    return user;
  }


  // 用户登陆
  async Login(body) {
    const { userName, passWord } = body;
    const user = await this.ctx.model.User.findOne({
      where: { userName },
    });
    if (!user) return {};

    const match = await bcrypt.compare(passWord, user.passWord);
    if (match) {
      const { id, userName } = user;
      // 获取jwt配置
      const { jwt: { secret, expiresIn } } = this.app.config;
      // 生成token
      const token = this.app.jwt.sign({
        id, userName,
      }, secret, { expiresIn });
      return { userName, token };
    }
  }
}

module.exports = UserService;

