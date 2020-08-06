const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path')
const process = require('process')

module.exports = {
    mode: process.env.production ? 'production' : 'development',
    entry: 'app',
    output: {
        path: path.resolve(process.env.buildDir || 'build/generated/sources/public'),
        filename: 'app.[hash].js'
    },
    module: {
        rules: [
            {test: /\.jsx?$/, use: 'babel-loader'}
        ]
    },
    resolve: {
        modules: ['node_modules', path.resolve('src/main/js')],
        extensions: ['.js', '.jsx']
    },
    plugins: [
        new webpack.EnvironmentPlugin(process.env),
        new HtmlWebpackPlugin({title: 'Chat'})
    ]
}
