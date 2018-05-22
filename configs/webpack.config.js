const webpack = require('webpack');
const path = require('path');
const DashboardPlugin = require('webpack-dashboard/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const { CheckerPlugin } = require('awesome-typescript-loader')

const PATHS = {
    root: path.resolve(__dirname, '..'),
    nodeModules: path.resolve(__dirname, '../node_modules'),
    src: path.resolve(__dirname, '../src'),
    dist: path.resolve(__dirname, '../dist'),
};

module.exports = {

    // Currently we need to add '.ts' to the resolve.extensions array.
    resolve: {
        modules: [PATHS.nodeModules],
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        descriptionFiles: ['package.json'],
    },

    // Source maps support ('inline-source-map' also works)
    devtool: 'source-map',

    // Add the loader for .ts files.
    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.(png|jpg|gif)$/, use: [{ loader: 'file-loader', options: {} }] },
            { test: /\.html/, loader: 'file-loader?name=[name].[ext]' }
        ]
    },
    //  plugins: [
    //      new CheckerPlugin()
    // ],

    entry: {
        app: [
            PATHS.src + '/index.tsx',
        ],
    },
    output: {
        path: PATHS.dist + "/static/",
        filename: 'bundle.js',
        publicPath: PATHS.root + '/public/',
        // chunkFilename: '[id].chunk.js',
    },

    plugins: [
        new DashboardPlugin(),
        new HtmlWebpackPlugin({
            template: './index.html'
        }),
    ]
};