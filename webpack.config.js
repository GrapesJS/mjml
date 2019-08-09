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
   // minimize breaks grapesjs integration, see
   optimization: {
      minimize: false
   },
   target: "web",
   externals: { 'grapesjs': 'grapesjs' }
};
