'use strict';
const _ = require('lodash');
require('dotenv').config()

const imgExt = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.psd', '.svg', '.tiff'];
const docExt = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.txt', '.md', '.csv'];
const videoExt = ['.mp4', '.avi', '.mov', '.rmvb', '.rm', '.flv', '.mkv', '.3gp', '.wmv', '.mpeg', '.mpg', '.dat', '.ts', '.mts', '.vob'];
const zipExt = ['.zip', '.rar', '.7z', '.gz', '.tar', '.iso'];

module.exports = appInfo => {
  const config = exports = {};

  const mysql_db = {
    dialect: 'mysql',
    host: '192.168.137.130',
    port: 13306,
    username: 'root',
    password: '123456',
    database: 'mvp-demo',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
  config.sequelize = process.env.db === 'mysql' ? mysql_db : sqlite_db;
  
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_{{keys}}';

  config.bodyParser = {
    jsonLimit: '100mb',
    formLimit: '100mb',
  };

  config.validate = {
    convert: true,
    widelyUndefined: true,
  }

  exports.multipart = {
    mode: 'stream',
    fileSize: '500mb',
    fileExtensions: [...imgExt, ...docExt, ...videoExt, ...zipExt], // 扩展几种上传的文件格式
  };

  config.uploadLocalPath = process.env.UPLOAD_LOCAL_PATH || '/data/html/';
  config.uploadBaseUrl = process.env.UPLOAD_BASE_URL || 'http://localhost:8080/';
  exports.oss = {
    client: {
      accessKeyId: process.env.ALI_OSS_ID || 'id',
      accessKeySecret: process.env.ALI_OSS_SECRET || 'secret',
      bucket: process.env.OSS_BUCKET || 'bucket',
      endpoint: process.env.ALI_OSS_ENDPOINT || 'oss-cn-hangzhou.aliyuncs.com',
      timeout: '60s',
    },
  };


  config.middleware = ['error']; // 在中间件里添加jwt中间件
  config.error = {
    // 这里使用appInfo.env来判断环境，仅仅在非生产环境下打开堆栈信息，用于调试
    postFormat: (e, obj) => (process.env.NODE_ENV === 'production' ? _.omit(obj, 'stack') : obj),
  };

  // 密码加密
  config.bcrypt = {
    saltRounds: 10,
  };

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: ['http://localhost:8080'], // 允许访问接口的白名单
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  config.logs = {
    level: 'info',
  };

  return config;
};
