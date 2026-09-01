const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        hashFunction: 'sha256'
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
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ]
    },
    optimization: {
        concatenateModules: false,
        minimizer: [
            new TerserPlugin({
                cache: false
            })
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new webpack.DefinePlugin({
            'process.env.GITHUB_SHA': JSON.stringify(process.env.GITHUB_SHA || 'local'),
            'process.env.GITHUB_REPOSITORY': JSON.stringify(process.env.GITHUB_REPOSITORY || ''),
            'process.env.GITHUB_SERVER_URL': JSON.stringify(process.env.GITHUB_SERVER_URL || 'https://github.com'),
            'process.env.GITHUB_RUN_ID': JSON.stringify(process.env.GITHUB_RUN_ID || ''),
            'process.env.DEPLOYMENT_RUN_ID': JSON.stringify(process.env.DEPLOYMENT_RUN_ID || '')
        }),
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        }),
        new HTMLInlineCSSWebpackPlugin(),
        new CopyPlugin([
            { from: 'src/webfonts', to: 'webfonts' },
            { from: 'src/css', to: 'css' },
            { from: 'src/works.json', to: 'works.json' },
            { from : 'src/videos', to: 'videos'},
            { from : 'src/img', to: 'img'},
            { from: "src/unityprojects", to: "unityprojects"}
        ])

    ],
    mode: 'production'
};