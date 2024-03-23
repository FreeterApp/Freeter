/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

const path = require('path');
const webpack = require('webpack');
const childProc = require('child_process');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

const configFile = path.join(__dirname, 'src', 'renderer', 'tsconfig.json');
const configFileObj = require(configFile);
const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

function getCommitHash() {
  return JSON.stringify(childProc.execSync('git rev-parse HEAD').toString().trim());
}

function getVersion() {
  return JSON.stringify(require("./package.json").version);
}

function getBuiltAt() {
  return JSON.stringify((new Date()).toISOString());
}

function getBackers() {
  return JSON.stringify(require("./backers.json"));
}

const appIconsSvgPath = path.join(__dirname, 'src', 'renderer', 'ui', 'assets', 'images', 'appIcons');
const widgetsRootPath = path.join(__dirname, 'src', 'renderer', 'widgets');

module.exports = {
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? undefined : 'eval-source-map',
  entry: {
    renderer: path.join(__dirname, 'src', 'renderer', 'index.tsx'),
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({
      configFile
    })]
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'swc-loader',
            options: {
              jsc: {
                target: configFileObj.target,
                paths: configFileObj.paths,
                transform: {
                  react: {
                    runtime: 'automatic',
                    development: isDev,
                    refresh: false,
                  },
                },
              },
            },
          },
        ]
      },
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1,
            },
          },
          'sass-loader',
        ],
        include: /\.module\.s?(c|a)ss$/,
      },
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ],
        exclude: /\.module\.s?(c|a)ss$/,
      },
      {
        test: /\.woff2$/i,
        type: 'asset/resource',
      },
      {
        test: /\.svg$/,
        include: [
          appIconsSvgPath,
          widgetsRootPath
        ],
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              spriteFilename: svgPath => {
                if (svgPath.startsWith(appIconsSvgPath)) {
                  return 'appIcons.svg';
                } else if (svgPath.startsWith(widgetsRootPath)) {
                  const wgtName = path.dirname(svgPath).slice(widgetsRootPath.length + 1).split(path.sep)[0];
                  return `widgets/${wgtName}/wgtIcons.svg`;
                }
              }
            }
          },
          {
            loader: 'svgo-loader'
          }
        ]
      }
    ]
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'build'),
      watch: false,
    },
    hot: false,
    liveReload: false,
    port: 4000,
    client: {
      webSocketURL: 'ws://localhost:4000/ws',
    },
    webSocketServer: false,
    allowedHosts: ['freeter-app'],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),

    isDev && new ForkTsCheckerWebpackPlugin({ typescript: { configFile } }),

    new HtmlWebpackPlugin({
      title: "Freeter",
      template: path.join(__dirname, 'src', 'renderer', 'index.ejs'),
      filename: "index.html",
      env: process.env.NODE_ENV,
      env_REACT_DEVTOOLS: process.env.REACT_DEVTOOLS
    }),

    new SpriteLoaderPlugin({
      plainSprite: true
    }),

    new webpack.DefinePlugin({
      VERSION: getVersion(),
      BUILT_AT: webpack.DefinePlugin.runtimeValue(getBuiltAt, true),
      COMMIT_HASH: webpack.DefinePlugin.runtimeValue(getCommitHash, true),
      BACKERS: getBackers()
    })
  ].filter(Boolean)
}
