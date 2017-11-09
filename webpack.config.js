var path = require('path');
var webpack = require('webpack');
var pkg = require('./package.json');
var name = 'grapesjs-mjml';
var env = process.env.WEBPACK_ENV;
var plugins = [];

if(env !== 'dev'){
  //plugins.push(new webpack.optimize.UglifyJsPlugin({compressor: { warnings: false }}));
  plugins.push(new webpack.BannerPlugin(pkg.name + ' - ' + pkg.version));
}

module.exports = {
  entry: './src',
  output: {
      filename: './dist/' + name + '.min.js',
      library: name,
      libraryTarget: 'umd',
  },
  module: {
    loaders: [{
        test: /\.js$/,
        loader: 'babel-loader',
        include: /src/,
        exclude: /node_modules/
    }],
  },
  plugins: plugins,
};
