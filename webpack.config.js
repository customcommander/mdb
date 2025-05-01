import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default function webpack_config(env) {
  return {
    entry: './src/main.js',
    mode: (env.production ? 'production' : 'development'),
    output: {
      clean: true,
      filename: 'bundle.js'
    },
    devServer: {
      static: './dist'
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'MDB',
        scriptLoading: 'module'
      }),
      new webpack.DefinePlugin({
        PRODUCTION: env.production === true,
      }),
    ]
  };
}

