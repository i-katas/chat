const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path')
const process = require('process')
const outputDir = path.resolve(process.env.buildDir || 'build/generated/sources/public')

module.exports = {
    mode: process.env.production ? 'production' : 'development',
    entry: 'app',
    output: {
        path: outputDir,
        filename: 'app.[hash].js'
    },
    module: {
        rules: [
            {test: /\.jsx?$/, use: 'babel-loader'},
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ],
            }
        ]
    },
    resolve: {
        modules: ['node_modules', path.resolve('src/main/js')],
        extensions: ['.js', '.jsx']
    },
    plugins: [
        new webpack.EnvironmentPlugin(process.env),
        new HtmlWebpackPlugin({title: 'Chat'})
    ],
    devServer: {
        contentBase: outputDir,
        compress: true,
        port: 9090
    }
}
