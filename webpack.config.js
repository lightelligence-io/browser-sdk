const path = require('path');

const baseConfig = {
  entry: './src/index-web.js',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
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
