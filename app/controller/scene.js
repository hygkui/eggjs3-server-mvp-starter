module.exports = app => {
  class SceneController extends app.Controller {
    async index() { // GET	/Scenes
      const { query } = this.ctx;
      const result = await this.ctx.app.model.Scene.findAll({
        where: query,
      });
      this.ctx.body = result;
    }

    async create() { // POST	/Scenes
      const data = this.ctx.request.body;
      const result = await this.ctx.app.model.Scene.create(data);
      this.ctx.body = result;
    }

    async destroy() { // DELETE	/Scenes/:id
      const { id } = this.ctx.params;
      this.ctx.body = await this.ctx.model.Scene.destroy({
        where: {
          id,
        },
      });
    }

    async show() { // GET	/Scenes/:id
      const { id } = this.ctx.params;
      const result = await this.ctx.app.model.Scene.findOne({ where: { id } });
      this.ctx.body = result;
    }

    async update() { // PUT	/Scenes/:id
      const data = this.ctx.request.body;
      const { id } = this.ctx.params;
      await this.ctx.app.model.Scene.update(data, { where: { id } });
      const result = await this.ctx.app.model.Scene.findOne({ where: { id } });
      this.ctx.body = result;
    }
  }

  return SceneController;
};
