'use strict';

function getTokenInfo(jwt, auth, secret) {
  // 判断请求头是否包含token
  if (
    auth.authorization &&
    auth.authorization.split(' ')[0] === 'Bearer'
  ) {
    const token = auth.authorization.split(' ')[1];
    let decode = '';
    if (token) {
      decode = jwt.verify(token, secret);
    }
    return decode;
  }
  return;
}

function toBoolean(str) {
  if (!str || typeof str !== 'string') {
    return false
  } else if (str === '1' || str === 'true' || str === 'TRUE') {
    return true
  }
}

function toInt(str) {
  if (!str || typeof str !== 'string') {
    return -1
  } else {
    return parseInt(str)
  }
}

function getEnv(propKey, type='string') {
  if (type === 'bool') {
    return toBoolean(process.env[propKey])
  } else if (type === 'int') {
    return toInt(process.env[propKey])
  }
  return process.env[propKey]
}


module.exports = {
  getTokenInfo,
  getEnv,
};
