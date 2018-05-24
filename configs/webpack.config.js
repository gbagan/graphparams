const webpack = require('webpack');
const path = require('path');
//const { CheckerPlugin } = require('awesome-typescript-loader')
//const DashboardPlugin = require('webpack-dashboard/plugin');
//const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const PATHS = {
    root: path.resolve(__dirname, '..'),
    nodeModules: path.resolve(__dirname, '../node_modules'),
    src: path.resolve(__dirname, '../src'),
    dist: path.resolve(__dirname, '../dist'),
};

module.exports = {
    resolve: {
        modules: [PATHS.nodeModules],
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        descriptionFiles: ['package.json'],
    },
    devtool: 'source-map',
    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
            { test: /\.css$/, use: [ MiniCssExtractPlugin.loader, "css-loader" ] },
            { test: /\.(png|jpg|gif)$/, use: [{ loader: 'file-loader', options: {} }] },
        ]
    },
    entry: {
        app: [
            PATHS.src + '/index.tsx',
        ],
    },
    output: {
        path: PATHS.dist + "/static/",
        //filename: 'bundle.js',
        publicPath: PATHS.root + '/public/',
        // chunkFilename: '[id].chunk.js',
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css",
            modules: true
        })
    ],
};