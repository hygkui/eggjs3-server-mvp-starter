/* eslint-disable no-trailing-spaces */
/* eslint-disable quotes */
/* eslint-disable semi */
/* eslint-disable comma-dangle */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
// const Sequelize = require('sequelize');
const { Sequelize, DataTypes } = require('sequelize');

const _ = require('lodash');
const { STRING, INTEGER, DECIMAL, DATE } = DataTypes;

const DB_DIALECT = 'sqlite'
// const DB_STORAGE = './db/p1.sqlite'

const default_blog_schema = { title: { field: "title", type: "STRING", allowNull: false } }
class SqlInstance {
    constructor(db_path) {
        this.dbDao = null
        this.auth(db_path)
    }

    auth(db_path) {
        if (!db_path) {
            db_path = './db/defalut.sqlite'
        }
        const sequelize = new Sequelize({
            dialect: DB_DIALECT,
            storage: db_path,
            typeValidation: true, // Run built-in type validators on insert, update and bulkCreate. Default: false
        });

        // Object.defineProperty(this.app, 'model', {
        //     value: sequelize,
        //     writable: false,
        //     configurable: false,
        // });

        this.dbDao = sequelize

        sequelize.authenticate();
    }

    dbModel(modelName, modelSchema = default_blog_schema) {
        const defaultModelSchema = {
            id: { field: 'id', type: INTEGER, primaryKey: true, autoIncrement: true },
            createTime: { field: 'create_time', type: DATE, comments: '创建时间' },
            updateTime: { field: 'update_time', type: DATE },
        }
        const schema = {
            ...defaultModelSchema,
            ...modelSchema
        }

        Object.keys(schema).forEach(key => {
            if (typeof schema[key].type === 'string') {
                schema[key].type = Sequelize.DataTypes[schema[key].type]
            }
        })

        return this.dbDao.define(modelName, schema, {
            timestamps: true,
            tableName: `tb_${modelName}`,
            createdAt: 'createTime',
            updatedAt: 'updateTime',
        });
    }

    async dbSync(force = false) {
        // todo: better to backup db before sync
        if (force) {
            await this.dbDao.sync({
                force: true,
            });
        } else {
            await this.dbDao.sync({
                alter: true
            });
        }
    }

    async modelSync(model, force = false) {
        await model.sync({
            force,
        });
    }

    async modelQueryList(model, where) {
        const res = await model.findAll({
            where,
            raw: true
        })
        console.log('res :>> ', res);
        return res
    }

    async modelCreate(model, data) {
        const res = await model.create(data)
        console.log('res :>> ', res.toJSON());
        return res
    }
}

module.exports = SqlInstance
