const { join } = require('path')
const { DefinePlugin } = require('webpack')
const isProd = false;
// const { isProd, assetPath, destAssetDir, toPosixPath } = require('./task/util')

module.exports = {
  mode: 'development',
  entry: {
    main: './src/js/main.js'
  },
  output: {
    path: join(__dirname, '/public', 'js'),
    filename: '[name].bundle.js',
    publicPath: join('/public', 'js/'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: join(__dirname, 'src/js'),
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              [
                'env',
                {
                  modules: false,
                  useBuiltIns: true,
                },
              ],
            ],
            plugins: [
              'transform-class-properties',
              'transform-object-rest-spread',
            ],
            cacheDirectory: true,
          },
        },
      },
    ],
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    new DefinePlugin({
      __DEV__: !isProd,
    }),
    // isProd &&
    //   new LicenseInfoWebpackPlugin({
    //     includeLicenseFile: false,
    //   }),
  ].filter(Boolean),
}
