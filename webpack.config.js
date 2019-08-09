const TerserPlugin = require('terser-webpack-plugin');
const pkg = require('./package.json');
const name = pkg.name;

module.exports = {
  entry: './src',
  mode: "production",
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
