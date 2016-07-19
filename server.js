var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.js');

var server = new WebpackDevServer(webpack(config))


// server.listen(3000, 'localhost', function (err, result) {
//   if (err) {
//     return console.log(err);
//   }

//   console.log('Webpack dev server listening on port 3000');
// });

// var webpack = require('webpack');
// var WebpackDevServer = require('webpack-dev-server');
// var config = require('./webpack.config.dev');

new WebpackDevServer(webpack(config), {
  publicPath: '/public/',
  hot: true,
  historyApiFallback: true
}).listen(3000, 'localhost', function (err, result) {
  if (err) {
    return console.log(err);
  }

  console.log('Webpack dev server listening on port 3000');
});
