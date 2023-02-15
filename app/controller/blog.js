module.exports = app => {
  class BlogController extends app.Controller {
    async index() { // GET	/Blogs
      const { query } = this.ctx;
      const result = await this.ctx.app.model.Blog.findAll({
        where: query,
      });
      this.ctx.body = result;
    }

    async create() { // POST	/Blogs
      const data = this.ctx.request.body;
      const result = await this.ctx.app.model.Blog.create(data);
      this.ctx.body = result;
    }

    async destroy() { // DELETE	/Blogs/:id
      const { id } = this.ctx.params;
      this.ctx.body = await this.ctx.model.Blog.destroy({
        where: {
          id,
        },
      });
    }

    async show() { // GET	/Blogs/:id
      const { id } = this.ctx.params;
      const result = await this.ctx.app.model.Blog.findOne({ where: { id } });
      this.ctx.body = result;
    }

    async update() { // PUT	/Blogs/:id
      const data = this.ctx.request.body;
      const { id } = this.ctx.params;
      await this.ctx.app.model.Blog.update(data, { where: { id } });
      const result = await this.ctx.app.model.Blog.findOne({ where: { id } });
      this.ctx.body = result;
    }
  }

  return BlogController;
};
