const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const DynamicCdnWebpackPlugin = require('dynamic-cdn-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'window'
    },
    resolveLoader: {
        modules: [path.join(__dirname, 'node_modules')]
    },
    resolve: {
        modules: [path.join(__dirname, 'node_modules')],
    },
    devServer: {
        contentBase: 'src/', //disk location
        watchContentBase: true
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        }),
        new CopyPlugin([
            { from: 'src/webfonts', to: 'webfonts' },
            { from: 'src/css', to: 'css' },
            { from: 'src/works.json', to: 'works.json' }
        ]),

    ]
};