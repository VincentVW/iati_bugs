var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        'babel-polyfill',
        './client/app/app.js'
    ],
    output: {
        path: path.resolve(__dirname, './public'),
        publicPath: '/',
        filename: 'bundle.js',
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['react-hot', 'babel-loader'],
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
        new webpack.HotModuleReplacementPlugin(),
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    devServer: {
      publicPath: '/',
      contentBase: ".",
      hot: true,
      historyApiFallback: true
    }
}
