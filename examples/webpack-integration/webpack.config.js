var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: __dirname + "/app",

  entry: {
    javascript: "./app.js",
    html: "./index.html",
  },

  output: {
    filename: "app.js",
    path: __dirname + "/dist",
  },

  plugins: [
    // provide translations plugin to interpolate translation arguments
    new webpack.ProvidePlugin({
      translations: path.resolve('./config/translations'),
    })
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ["babel-loader"],
      },
      {
        test: /\.html$/,
        loader: "file?name=[name].[ext]",
      },
      // json loader to parse json to javascript object
      {
        test: /\.json$/,
        loader: 'json'
      },
      // mount i18n-replace plugin
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          plugins: [
            [
              // will be 'i18n-replace' in your config
              path.resolve('../../src'), {
                alias: '__t',
                replaceWith: 'translations.interpolate',
                // json file with translations, requires json loader
                translations: require('./config/i18n/en')
              }
            ]
          ]
        }
      }
    ],
  },
}
