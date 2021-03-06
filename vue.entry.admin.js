const path = require('path')
const apiMocker = require('mocker-api')

module.exports = {
  appPath: '/admin',
  appName: 'Agile 管理后台',
  appEntry: {
    admin: './src/modules/admin/main.js',
  },
  appAlias: {
    '@admin': path.resolve('src/modules/admin'),
  },
  appChunks: ['vendor', 'element', 'agile', 'admin'],
  outputDir: 'dist/admin',
  pwaEnable: true,
  vueConfig: {
    devServer: {
      port: 8080,
      before(app) {
        apiMocker(app, path.resolve('./mocker/admin/index.js'))
      },
    },
  },
}
