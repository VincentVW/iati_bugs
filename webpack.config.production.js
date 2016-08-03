var path = require('path');
var webpack = require('webpack')

module.exports = {
    entry: [
        'babel-polyfill',
        './client/app/app.js'
    ],
    output: {
        path: path.resolve(__dirname, 'public'),
        publicPath: '/',
        filename: 'bundle.js',
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['babel-loader'],
                exclude: /(node_modules|bower_components)/,
            },
            { test: /\.json/, loaders: ['json'] },
            { test: /\.s?css$/, loaders: ['style', 'css', 'sass'] },
            { test: /\.png$/, loader: "url-loader?limit=100000" },
            { test: /\.jpg$/, loader: "file-loader?name=[path][name]" },
            { test: /\.svg/, loader: "file-loader" }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.DefinePlugin({
          GA_TRACKING_CODE: JSON.stringify('UA-81567494-1'),
          GA_CONFIG: {
            'name': 'BugGaTracker'
          }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        })
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
}
