const webpack = require('webpack');
const path = require('path');
//const { CheckerPlugin } = require('awesome-typescript-loader')
//const DashboardPlugin = require('webpack-dashboard/plugin');
//const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CircularDependencyPlugin = require('circular-dependency-plugin');

const PATHS = {
    root: path.resolve(__dirname, '..'),
    nodeModules: path.resolve(__dirname, '../node_modules'),
    src: path.resolve(__dirname, '../src'),
    dist: path.resolve(__dirname, '../dist'),
};

module.exports = (env = {}) => {
    console.log({ env });
    const isBuild = !!env.build;
    const isDev = !env.build;
    const isSourceMap = !!env.sourceMap || isDev;

    return {
        cache: true,
        mode: isBuild ? 'production' : 'development',

        resolve: {
            modules: [PATHS.nodeModules],
            extensions: [".ts", ".tsx", ".js", ".jsx"],
            descriptionFiles: ["package.json"],
            alias: {
                '@': PATHS.src,
            }
        },
        devtool: "source-map",
        module: {
            rules: [
                { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
                { test: /\.(sa|sc|c)ss$/, use: [MiniCssExtractPlugin.loader,
                                                {loader: "css-loader", options: {modules: true} },
                                                "sass-loader"
                                               ] },
                { test: /\.(png|jpg|gif|svg)$/, use: [ { loader: 'url-loader', options: { limit: 8192 } } 
                                                 ] },
                { test: /\.worker\.js$/, use: { loader: "worker-loader" } }
            ]
        },
        entry: {
            app: [
                PATHS.src + "/index.tsx",
            ],
        },
        output: {
            path: PATHS.dist + "/static/",
            publicPath: "static/",
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "[name].css",
                chunkFilename: "[id].css",
                modules: true
            }),
            new CircularDependencyPlugin({
              exclude: /a\.js|node_modules/,
              failOnError: true,
              cwd: process.cwd(),
            })
        ]
    }
}