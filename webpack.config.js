const path = require("path");
const spreadPlugin = require("babel-plugin-transform-object-rest-spread");
const transformRuntimePlugin = require("babel-plugin-transform-runtime");

const baseConfig = {
  entry: "./src/index-web.js",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        enforce: "pre"
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["env"],
            plugins: [spreadPlugin, transformRuntimePlugin]
          }
        }
      }
    ]
  }
};

const nodeConfigDev = {
  ...baseConfig,
  devtool: "source-map",
  mode: "development",
  target: "node",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.node.js"
  }
};

const nodeConfigProd = {
  ...baseConfig,
  mode: "production",
  target: "node",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.node.min.js"
  }
};

const webConfigDev = {
  ...baseConfig,
  devtool: "source-map",
  mode: "development",
  target: "web",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.web.js",
    library: "olt-js-sdk",
    libraryTarget: "umd",
    umdNamedDefine: true
  }
};

const webConfigProd = {
  ...baseConfig,
  mode: "production",
  target: "web",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.web.min.js",
    library: "olt-js-sdk",
    libraryTarget: "umd",
    umdNamedDefine: true
  }
};

module.exports = [nodeConfigDev, nodeConfigProd, webConfigDev, webConfigProd];
