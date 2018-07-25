const path = require('path');

const baseConfig = {
  entry: './src/index.js',
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
  },
};

module.exports = [nodeConfig, webConfig];
