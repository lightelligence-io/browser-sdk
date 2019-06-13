const path = require("path");

const baseConfig = {
  entry: "./src/index.js",
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
            presets: ["@babel/preset-env"],
            plugins: [
              "@babel/plugin-proposal-object-rest-spread",
              "@babel/plugin-transform-runtime"
            ]
          }
        }
      }
    ]
  }
};

const webConfigDev = {
  ...baseConfig,
  devtool: "source-map",
  mode: "development",
  target: "web",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    library: "olt-browser-sdk",
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
    filename: "bundle.min.js",
    library: "olt-browser-sdk",
    libraryTarget: "umd",
    umdNamedDefine: true
  }
};

module.exports = [webConfigDev, webConfigProd];
