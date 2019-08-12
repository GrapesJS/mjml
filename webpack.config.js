const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const fs = require('fs');
const pkg = require('./package.json');
const name = pkg.name;
let plugins = [];

module.exports = (env, options) => {
  const isProd = (options.mode === 'production');
  if (!isProd) {
    const index = 'index.html';
    const indexDev = `_${index}`;
    const template = fs.existsSync(indexDev) ? indexDev : index;
    plugins.push(new HtmlWebpackPlugin({ template }));
  }

  return {
    entry: './src',
    mode: isProd ? 'production' : 'development',
    output: {
      path: path.join(__dirname),
      filename: `dist/${name}.min.js`,
      library: name,
      libraryExport: 'default',
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
    target: 'web',
    plugins: plugins
  };
};
