'use strict';
const { Controller } = require('egg');

class HomeController extends Controller {
  async system() {
    const { ctx } = this;
    ctx.body = {
      name: 'mvp-server',
      version: '0.2',
      buildAt: '2021-08-19 14:11:01.378'
    }
  }

  async getProvince() {
    const provinces = require('../extend/divisions/provinces.json')
    this.ctx.body = provinces
  }

  async getCity() {
    const { ctx } = this
    const { code } = ctx.query
    if (!code) {
      return []
    }

    const cities = require('../extend/divisions/cities.json')
    const result = cities.filter(city => city.code.startsWith(code))
    ctx.body = result
  }

  async getCounty() {
    const { ctx } = this
    const { code } = ctx.query
    if (!code) {
      return []
    }

    const areas = require('../extend/divisions/areas.json')
    const result = areas.filter(area => area.code.startsWith(code))
    ctx.body = result
  }

}

module.exports = HomeController;
