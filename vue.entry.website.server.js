const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

module.exports = {
  entry: './src/modules/website/entry.server.js',
  target: 'node',
  output: {
    libraryTarget: 'commonjs2',
  },
  optimization: {
    splitChunks: false,
  },
  module: {
    rules: [],
  },
  plugins: [new VueSSRServerPlugin()],
}
