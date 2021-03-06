var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var OccurrenceOrderPlugin = webpack.optimize.OccurrenceOrderPlugin;
var DedupePlugin = webpack.optimize.DedupePlugin;
var WebpackNotifierPlugin = require('webpack-notifier');
var path = require('path');
var env = require('yargs').argv.mode;

var libraryName = 'WhiteLabel';
var source = '/src/index.js';

var plugins = [],
    outputFile;

if (env === 'build') {
    plugins.push(new UglifyJsPlugin({
        minimize: true,
        compress: {
            warnings: false
        }
    }));
    plugins.push(new OccurrenceOrderPlugin());
    plugins.push(new DedupePlugin());
    outputFile = libraryName.toLowerCase() + '.min.js';
} else {
    outputFile = libraryName.toLowerCase() + '.js';
    plugins.push(new WebpackNotifierPlugin());
}

const config = {
    entry: ['babel-polyfill', __dirname + source],
    devtool: 'source-map',
    output: {
        path: __dirname + '/browser',
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    externals: {},
    module: {
        loaders: [{
            test: /(\.jsx|\.js)$/,
            loader: 'babel',
            exclude: /(node_modules|bower_components)/
        }, {
            test: /(\.jsx|\.js)$/,
            loader: 'eslint-loader',
            exclude: /node_modules/
        }]
    },
    resolve: {
        root: path.resolve('./src'),
        extensions: ['', '.js']
    },
    plugins: plugins
};

module.exports = config;
