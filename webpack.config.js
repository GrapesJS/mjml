const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const path = require('path');
const fs = require('fs');
const pkg = require('./package.json');
const name = pkg.name;
let plugins = [];
let localeEntries = [];

function getLocaleEntries (){
  return fs.readdirSync('./src/locale/')
    .map((file) => {
      const basename = path.basename(file, '.js');
      return {
        name: basename,
        path: `./src/locale/${file}`,
        from: `./dist/${basename}.min.js`,
        to: `./locale/${file}`
      };
    });
}

function createLocaleEntries () {
  return getLocaleEntries().reduce((locale, file) => {
    locale[file.name] = file.path;
    return locale;
  }, {});
}

function moveLocaleOutput () {
  return getLocaleEntries().map(file => {
    return {
      source: file.from,
      destination: file.to
    };
  });
}

module.exports = (env, options) => {
  const isProd = (options.mode === 'production');

  const output = {
    path: path.join(__dirname),
    filename: 'dist/[name].min.js',
    library: name,
    libraryExport: 'default',
    libraryTarget: 'umd',
  };

  if (isProd) {
    plugins.push(new FileManagerPlugin({
      onEnd: {
        mkdir: ['./locale'],
        move: moveLocaleOutput()
      }
    }));
    localeEntries = createLocaleEntries();
  } else if (options.mode === 'development') {
    output.filename = 'dist/[name].js';
  } else {
    const index = 'index.html';
    const indexDev = `_${index}`;
    const template = fs.existsSync(indexDev) ? indexDev : index;
    plugins.push(new HtmlWebpackPlugin({ template }));
  }

  return {
    entry: {
      [name]: './src',
      ...localeEntries,
    },
    mode: isProd ? 'production' : 'development',
    output: output,
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
