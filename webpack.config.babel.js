import path from 'path';

export default {
  devtool : 'eval',
  entry : './src/index',
  output : {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  module : {
    loaders: [
      {
        test: /\.js$/,
        loaders: [
          'babel', 'react-hot-loader/webpack'
        ],
        exclude: /node_modules/,
        include: __dirname
      }, {
        test: /\.css$/,
        loader: 'style-loader'
      }, {
        test: /\.css$/,
        loader: 'css-loader',
        query: {
          modules: true,
          localIdentName: '[name]__[local]___[hash:base64:5]'
        }
      }
    ]
  }
};
