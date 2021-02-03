/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const path = require('path')
const fs = require('fs')

module.exports = (env) => {
  return {
    mode: env.NODE_ENV,
    entry: {
      app: [path.resolve(__dirname, 'src/app/app.ts')],
    },
    output: {
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]?[hash]',
                publicPath: './dist',
                outputPath: 'images',
              },
            },
          ],
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'fonts',
              },
            },
          ],
        },
        {
          test: /\.(css)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'css',
              },
            },
          ],
        },
        {
          test: /\.html$/i,
          loader: 'html-loader',
        },
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                plugins: ['@babel/plugin-transform-runtime'],
              },
            },
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true, // For hot reloading,
                experimentalWatchApi: true,
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'style-loader', // Creates style nodes from JS strings
              options: {
                insert: 'head',
                injectType: 'singletonStyleTag',
              },
            },
            {
              loader: 'css-loader', // Translates CSS into CommonJS
            },
            {
              loader: 'postcss-loader', // More CSS Plugins
              options: {
                postcssOptions: {
                  plugins: [require('autoprefixer')],
                },
              },
            },
            {
              loader: 'sass-loader', // Compiles Sass to CSS, using Node Sass by default
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        hash: true,
        filename: 'index.html',
        template: './src/index.html',
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: './src/assets/images', to: 'images' }],
      }),
      new MiniCSSExtractPlugin(),
    ],
    devServer: {
      open: true,
      port: 4000,
      host: 'new-crm.datapot.ch',
      https: true,
      key: fs.readFileSync('ssl/private1.key'),
      cert: fs.readFileSync('ssl/private1.crt'),
      hot: true,
      historyApiFallback: true,
      watchOptions: {
        poll: true,
      },
      contentBase: './dist',
      compress: true,
    },
    devtool: 'source-map',
    optimization: {
      minimizer: [
        new UglifyJSPlugin({
          uglifyOptions: {
            keep_classnames: true,
            keep_fnames: true,
          },
        }),
      ],
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: 'all',
            test: path.resolve(__dirname, 'node_modules'),
            name: 'vendor',
            enforce: true,
          },
        },
      },
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        styles: path.resolve(__dirname, 'src/styles'),
        assets: path.resolve(__dirname, 'src/assets'),
        '~': path.resolve(__dirname, 'src/app'),
      },
    },
  }
}
