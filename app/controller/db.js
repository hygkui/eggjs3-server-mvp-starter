/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
'use strict';
const bcrypt = require('bcryptjs');
const { Controller } = require('egg');
const SqlInstance = require('../extend/dbSql');
class DBController extends Controller {

    async getDBModel(projectId, modelName = 'user') {
        const { ctx } = this
        const dbPath = `db/project_${projectId}.sqlite`;
        const dbSql = new SqlInstance(dbPath);
        const item = await ctx.model.ProjectModel.findOne({
            where: {
                projectId,
                name: modelName,
            },
            raw: true,
        })

        if (!item) {
            throw new Error('model not defined')
        }

        const schema = JSON.parse(item.schema);
        const Model = dbSql.dbModel(modelName, schema);
        if (!Model) {
            throw new Error('model not exist')
        }
        return Model;
    }

    async createDB() { // 创建数据库，不是必须的，如果没有数据库，会自动创建
        const { ctx } = this;
        const { projectId } = ctx.request.body;
        const dbPath = `db/project_${projectId}.sqlite`;
        const dbSql = new SqlInstance(dbPath);
        await dbSql.dbSync(true);
        ctx.body = 'create db ok';
    }

    async upsertModel() { // 创建或更新模型
        const { ctx } = this;
        const { projectId, modelName, schemaStr, force } = ctx.request.body;
        const dbPath = `db/project_${projectId}.sqlite`;
        // query if exist
        const item = await ctx.model.ProjectModel.findOne({
            where: {
                projectId,
                name: modelName,
            },
            raw: true,
        })

        const dbSql = new SqlInstance(dbPath);

        if (item) {
            // update
            if (!schemaStr) {
                throw new Error('schemaStr is required')
            }
            await ctx.model.ProjectModel.update({
                schema: schemaStr,
            }, {
                where: {
                    projectId,
                    name: modelName,
                },
            })
        } else {
            // create
            await ctx.model.ProjectModel.create({
                projectId,
                name: modelName,
                schema: schemaStr,
            })
        }

        const schema = JSON.parse(schemaStr);
        const Model = dbSql.dbModel(modelName, schema);
        const isForce = force === '1'
        await dbSql.modelSync(Model, isForce);
        ctx.body = 'model update ok'
    }

    async modelMethod() { // 执行查询方法
        const { ctx } = this;
        const { projectId, modelName, method, params } = ctx.request.body;
        const METHODS = [ 'find', 'findOne', 'findAll', 'create', 'update', 'delete', 'bulkCreate' ]
        if (!METHODS.includes(method)) {
            throw new Error(`method ${method} not support`)
        }
        const Model = await this.getDBModel(projectId, modelName)
        const data = params ? JSON.parse(params) : null
        // const res = await Model[method](data);
        let res = null
        const id = data ? data.id : null
        switch (method) {
            case 'find':
            case 'findOne':
            case 'findAll':
                res = await Model[method]({ where: data });
                break;
            case 'create':
                res = await Model[method](data);
                break;
            case 'update':
                delete data.id
                res = await Model[method](data, { where: { id } });
                break;
            case 'delete':
                res = await Model[method]({ where: { id } });
                break;
            case 'bulkCreate':
                res = await Model[method](data);
                break;
            default:
                break;
        }
        ctx.body = res
    }

    async modelSchema() { // 获取模型的schema
        const { ctx } = this;
        const { projectId, modelName } = ctx.request.body;
        const item = await ctx.model.ProjectModel.findOne({
            where: {
                projectId,
                name: modelName,
            },
            raw: true,
        })

        if (!item) {
            throw new Error('model not exist')
        }

        const schema = JSON.parse(item.schema);
        ctx.body = schema
    }

    async signup() {
        const { ctx } = this;
        const { projectId, modelName = 'user', username, password } = ctx.request.body;

        // check if username exist
        const User = await this.getDBModel(projectId, modelName);
        const user = await User.findOne({ where: { username } })
        if (user) {
            throw new Error('user exist')
        }

        // create user
        const hash = bcrypt.hashSync(password, this.config.bcrypt.saltRounds);
        const res = await User.create({ username, password: hash });
        ctx.body = { id: res.id, username }
    }

    async login() {
        const { ctx } = this;
        const { projectId, modelName = 'user', username, password } = ctx.request.body;

        const User = await this.getDBModel(projectId, modelName);
        const user = await User.findOne({
            where: { username },
        });
        console.log('user :>> ', user);
        if (!user) {
            throw new Error('user not exist');
        }

        const match = await bcrypt.compare(password, user.password);
        console.log('match :>> ', match);
        if (!match) {
            throw new Error('password not match');
        }


        const { id } = user;
        // 获取jwt配置
        const { jwt: { secret, expiresIn } } = this.app.config;
        // 生成token
        const token = this.app.jwt.sign({
            id,
            username,
        }, secret, { expiresIn });
        ctx.body = { username, token };
    }
}

module.exports = DBController;
