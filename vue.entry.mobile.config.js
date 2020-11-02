const path = require('path')
const assign = require('assign-deep')
const apiMocker = require('mocker-api')

const vueConfig = require('./vue.config')

const customConfig = {
  publicPath: '/mobile',
  outputDir: 'dist/mobile',
  pages: {
    admin: {
      entry: 'src/modules/mobile/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Agile 移动端',
      chunks: ['vendor', 'element', 'agile', 'mobile'],
      apiHost: process.env.VUE_APP_MOBILE_API_HOST,
    },
  },
  devServer: {
    port: 8081,
    before(app) {
      apiMocker(app, path.resolve('./mocker/mobile/index.js'))
    },
  },
}

module.exports = assign(vueConfig, customConfig)
