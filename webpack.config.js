const webpack = require('webpack');
const path = require('path');

const ExtractTextlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

    entry: {
        main: ['./source/client/app/index.js']
    },

    output: {
        path: path.resolve('public/build'),
        filename: '[hash].[name].js',
        publicPath: '/'
    },

    devServer: {
        port: 3001,
        historyApiFallback: true,

        proxy: {
            "*": "http://[::1]:3000"
        }
    },

    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ExtractTextlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.(jpg|png|gif)$/,
                loader: 'file-loader',
                options: {

                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './source/client/index.html',
            filename: 'index.html',
            inject: 'body',
            minify: {
                collapseWhitespace: true
            }
        }),
        new ExtractTextlugin({
            filename: '[contenthash].[name].css',
            allChunks: true
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'dev')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true
        })
    ]
}