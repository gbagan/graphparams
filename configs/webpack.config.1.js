const path = require('path');
const webpack = require('webpack');
const DashboardPlugin = require('webpack-dashboard/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
  root: path.resolve(__dirname, '..'),
  nodeModules: path.resolve(__dirname, '../node_modules'),
  src: path.resolve(__dirname, '../src'),
  dist: path.resolve(__dirname, '../dist'),
};

const DEV_SERVER = {
  hot: true,
  hotOnly: true,
  historyApiFallback: true,
  overlay: true,
  // stats: 'verbose',
  // proxy: {
  //   '/api': 'http://localhost:3000'
  // },
};

module.exports = (env = {}) => {
  console.log({ env });
  const isBuild = !!env.build;
  const isDev = !env.build;
  const isSourceMap = !!env.sourceMap || isDev;

  return {
    cache: true,
    devtool: isDev ? 'eval-source-map' : 'source-map',
    devServer: DEV_SERVER,

    context: PATHS.root,

    entry: {
      app: [
        'react-hot-loader/patch',
        './src/index.tsx',
      ],
    },
    output: {
      path: PATHS.dist,
      filename: isDev ? '[name].js' : '[name].[hash].js',
      publicPath: '/public/',
      // chunkFilename: '[id].chunk.js',
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      modules: ['src', 'node_modules'],
    },

    module: {
      rules: [
        // typescript
        {
          test: /\.tsx?$/,
          include: PATHS.src,
          use: (env.awesome ?
            [
              { loader: 'react-hot-loader/webpack' },
              {
                loader: 'awesome-typescript-loader',
                options: {
                  transpileOnly: true,
                  useTranspileModule: false,
                  sourceMap: isSourceMap,
                },
              },
            ] : [
              { loader: 'react-hot-loader/webpack' },
              {
                loader: 'ts-loader',
                options: {
                  transpileOnly: true,
                  compilerOptions: {
                    'sourceMap': isSourceMap,
                    'target': isDev ? 'es2016' : 'es2016',
                    'isolatedModules': true,
                    'noEmitOnError': false,
                  },
                },
              },
            ]
          ),
        },
        // json
        {
          test: /\.json$/,
          include: [PATHS.src],
          use: { loader: 'json-loader' },
        },
      ],
    },

    plugins: [
      new DashboardPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(isDev ? 'development' : 'production'),
        },
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: (module) => module.context && module.context.indexOf('node_modules') !== -1,
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html'
      }),
      ...(isDev ? [
        new webpack.HotModuleReplacementPlugin({
          // multiStep: true, // better performance with many files
        }),
        new webpack.NamedModulesPlugin(),
      ] : []),
      ...(isBuild ? [
        new webpack.LoaderOptionsPlugin({
          minimize: true,
          debug: false
        }),
        new webpack.optimize.UglifyJsPlugin({
          beautify: false,
          compress: {
            screw_ie8: true
          },
          comments: false,
          sourceMap: isSourceMap,
        }),
      ] : []),
    ]
  };

};