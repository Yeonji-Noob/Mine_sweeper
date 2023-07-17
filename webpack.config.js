const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  mode: 'development', // production
  devtool: 'eval', // hidden-source-map 
  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts'],
  },

  entry: {
    app: './client',
  },
  module: {
    rules: [{
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      {
        test: /\.(png|jpg)$/,
        use: ["file-loader"]
      }
    ]
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),
  ],
  // output: {
  //   filename: '[name].js',
  //   path: path.join(__dirname, 'dist'),
  //   publicPath: '/dist',
  // },
  devServer: {
    devMiddleware: {
      publicPath: '/dist/'
    },
    static: {
      directory: path.resolve(__dirname)
    },
    hot: true
  }
};