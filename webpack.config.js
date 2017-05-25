var path = require("path");
var config = {
  context: path.resolve(__dirname, "src"),
  // main entry point to application
  entry: "./js/index.js",
  output: {
    // place output bundle here
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  // watch files for changes
  watch: true,
  module: {
    rules: [{
      // allows to use ES 2015 features
      test: /\.js$/,
      include: [path.resolve(__dirname, "src/js")],
      use: {
        loader: "babel-loader",
        options: {presets: ["es2015"]}
      }
    }, {
      // convert sass to css
      test: /\.(sass|scss)$/,
      include: [path.resolve(__dirname, "src/css")],
      use: ["style-loader", "css-loader", "sass-loader"]
    }, {
      // copy static html and favicon
      test: /\.(html|ico)$/,
      include: [path.resolve(__dirname, "src")],
      use: ["file-loader?name=[path][name].[ext]"]
    }]
  },
  // development server
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    compress: true, // enable gzip compression
    port: 3001
  }
};
module.exports = config;
