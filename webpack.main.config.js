/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

const path = require('path');
const webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const configFile = path.join(__dirname, 'src', 'main', 'tsconfig.json');
const configFileObj = require(configFile);
const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

module.exports = {
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? undefined : 'source-map',
  entry: {
    main: path.join(__dirname, 'src', 'main', 'index.ts'),
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({
      configFile
    })]
  },
  target: 'electron-main',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'swc-loader',
            options: {
              jsc: {
                target: configFileObj.target,
                paths: configFileObj.paths,
              },
            },
          },
        ],
        exclude: /node_modules/,
      }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
    isDev && new ForkTsCheckerWebpackPlugin({ typescript: { configFile } }),
  ],
  node: {
    __dirname: false,
    __filename: false,
  }
}
