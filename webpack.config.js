const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: [
      'babel-polyfill',
      './new-src/index.js',
      'react-hot-loader/patch',
    ],
    worker: [
      'babel-polyfill',
      './new-src/worker/index.js',
      'react-hot-loader/patch',
    ],
  },
  devtool: 'source-map',
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
  },
  devServer: {
    contentBase: './',
    port: 9001,
    publicPath: '/dist/',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.md$/,
        use: 'text-loader',
      },
      {
        test: /\.yaml$/,
        use: [
          { loader: 'json-loader' },
          { loader: 'yaml-loader' },
        ],
      },
    ],
  },
};
