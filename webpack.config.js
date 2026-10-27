const fs = require('node:fs');
const path = require('node:path');

const browserModules = {
  fs: () => {
    const unavailable = () => {
      throw new Error('Filesystem access is unavailable in the MJML browser compiler');
    };
    return { readFileSync: unavailable, existsSync: () => false, lstatSync: unavailable };
  },
  // Keep MJML's filesystem/configuration branches disabled, including in Node.
  'detect-node': () => false,
  // Match mjml-browser: preserve embedded JavaScript during HTML minification.
  'uglify-js': () => ({ minify: (source) => ({ code: source }) }),
  './helpers/mjmlconfig': () => {
    const emptyConfig = () => ({ mjmlConfig: { packages: [], options: {} } });
    return {
      default: emptyConfig,
      readMjmlConfig: emptyConfig,
      handleMjmlConfigComponents: () => ({ success: [], failures: [] }),
    };
  },
};

module.exports = ({ config, pkg, webpack }) => {
  const TerserPlugin = require('terser-webpack-plugin');
  config.resolve.alias = {
    ...config.resolve.alias,
    path: require.resolve('path-browserify'),
  };
  config.resolve.fallback = {
    ...config.resolve.fallback,
    buffer: require.resolve('buffer/'),
    process: require.resolve('process/browser'),
    os: false,
    util: false,
    stream: false,
    http: false,
    https: false,
    url: require.resolve('url/'),
    crypto: false,
  };
  config.plugins.push(
    new webpack.BannerPlugin({
      banner: fs.readFileSync(path.join(path.dirname(require.resolve('mjml-core/package.json')), 'LICENSE.md'), 'utf8'),
      entryOnly: true,
    }),
    new webpack.ProvidePlugin({
      process: require.resolve('process/browser'),
      Buffer: [require.resolve('buffer/'), 'Buffer'],
    }),
    new webpack.NormalModuleReplacementPlugin(
      /^(fs|detect-node|uglify-js|\.\/helpers\/mjmlconfig)$/,
      (resource) => {
        const factory = browserModules[resource.request];
        // Webpack supports inline CommonJS modules through data URLs.
        const source = `module.exports = (${factory.toString()})();`;
        resource.request = `data:application/node;base64,${Buffer.from(source).toString('base64')}`;
      },
    ),
  );
  // Node-only skeleton loading is disabled by the detect-node replacement.
  config.ignoreWarnings = [
    ...(config.ignoreWarnings || []),
    { module: /mjml-core[\\/]lib[\\/]index\.js$/, message: /Critical dependency/ },
  ];
  config.optimization.minimizer = [new TerserPlugin({
    extractComments: true,
    terserOptions: {
      // MJML derives tag names from class names unless componentName is set.
      keep_classnames: true,
      keep_fnames: true,
      compress: { evaluate: false },
      format: { comments: false, preamble: `/*! ${pkg.name} - ${pkg.version} */` },
    },
  })];
  return config;
};

module.exports.browserModules = browserModules;
