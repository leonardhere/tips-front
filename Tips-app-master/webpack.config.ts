const path = require("path");
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

// Common
const common = {
    entry: "./src/index.tsx",
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    output: {
      path: path.join(__dirname, "/dist"),
      filename: "bundle.js"
    },
    module: {
      rules: [
          {
              test: /\.ts(x?)$/,
              exclude: /(node_modules)/,  // исключаем из обработки папку node_modules
              loader: "babel-loader",   // определяем загрузчик
              options:{
                  presets:['@babel/preset-typescript', "@babel/preset-env", "@babel/preset-react"]    // используемые плагины
              }
          },
          {
              enforce: "pre",
              test: /\.js$/,
              loader: 'source-map-loader'
          },
          {
              test: /\.scss$/,
              use: [
                  'style-loader',
                  { loader: 'css-loader', options: { importLoaders: 3, sourceMap: true } },
                  { loader: 'postcss-loader', options: { sourceMap: true } },
                  'sass-loader'
              ]
          },
          {
              test: /\.css$/,
              use: [
                    'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 2, sourceMap: true } },
                    { loader: 'postcss-loader', options: { sourceMap: true } }
                ]
          },
          {
            test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf|otf)$/,
            use: [
              'file-loader'
            ]
          }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
          template: './public/index.html'
      })
    ]
};

// Dev server
const devServer = () => ({
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 80,
        progress: true
    },
    devtool: "inline-source-map"
});

// Production css
const extractCss = () => ({
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { importLoaders: 4, sourceMap: true } },
                    { loader: 'postcss-loader', options: { sourceMap: true } },
                    'sass-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 3 } },
                    { loader: 'postcss-loader', options: { sourceMap: true } }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].css',
            chunkFilename: '[id].css',
        })
    ]
})

// Prod optimize
const optimize = () => ({
    optimization: {
        minimizer: [
            new TerserPlugin({
              cache: true,
              parallel: true,
              sourceMap: true, // Must be set to true if using source-maps in production
              terserOptions: {
                // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
              }
            }),
          ],
    },
    devtool: 'cheap-module-eval-source-map'
})

module.exports = (env, argv) => {
    // return common;
    if(argv.mode === 'production') {
        return merge([
            common,
            optimize()
        ])
    }

    if(argv.mode === 'development') {
        return merge([
            common,
            devServer(),
            extractCss()
        ])
    }
};