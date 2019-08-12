const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const pkg = require('./package.json');
const name = pkg.name;

module.exports = {
  entry: './src',
  mode: "development",
  output: {
    filename: `./${name}.min.js`,
    library: name,
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  resolve: {
    alias: {
      'fs': path.resolve(__dirname, 'mocks/fs'),
      'uglify-js': path.resolve(__dirname, 'mocks/uglify-js'),
    }
  },
  // make sure to keep_fnames or else it will break grapesjs, see https://github.com/artf/grapesjs-mjml/issues/110
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_fnames: true
        },
      }),
    ],
  },
  target: "web",
  externals: { 'grapesjs': 'grapesjs' }
};
