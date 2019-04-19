import path from 'path';
import initPlugins from './webpack.plugins';

// eslint-disable-next-line no-undef
const distPath = path.resolve(__dirname, '../dist');
const assetsPath = '/assets/js/';
// eslint-disable-next-line no-undef
const isProd = process.env.NODE_ENV === 'production';
const srcApp = 'src/scripts/app.js';
const regexNodeMods = /[\\/]node_modules[\\/]/;

export const webpackConfig = {
  mode: isProd ? 'production' : 'development',
  context: distPath,
  devtool: 'source-map',
  entry: {
    app: `../${srcApp}`,
  },
  output: {
    path: distPath + assetsPath,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: regexNodeMods,
        loader: 'babel-loader',
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        commons: {
          test: regexNodeMods,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
  plugins: initPlugins(isProd),
};
