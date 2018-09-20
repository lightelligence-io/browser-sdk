const path = require('path');
const spreadPlugin = require('babel-plugin-transform-object-rest-spread');
const transformRuntimePlugin = require('babel-plugin-transform-runtime');

const baseConfig = {
  devtool: 'source-map',
  entry: './src/index-web.js',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        enforce: 'pre',
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            plugins: [spreadPlugin, transformRuntimePlugin],
          },
        },
      },
    ],
  },
};

const nodeConfig = {
  ...baseConfig,
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.node.js',
  },
};

const webConfig = {
  ...baseConfig,
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.web.js',
    library: 'olt-js-sdk',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
};

module.exports = [nodeConfig, webConfig];
