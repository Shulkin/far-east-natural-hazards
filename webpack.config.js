var webpack = require("webpack");
var path = require("path");
var config = {
  context: path.resolve(__dirname, "src"),
  entry: {
    // main entry point to application
    main: "./js/main.js",
    // third-party libraries (not installed in node_modules!)
    vendor: "./vendor/vendor.js"
  },
  output: { // path to output
    path: path.resolve(__dirname, "dist"),
    // separate app and openlayers3 bundle
    filename: "bundle.[name].js"
  },
  watch: true, // rebuild when file changes
  module: {
    rules: [{ // allows to use ES 2015 features
      test: /\.js$/,
      include: [path.resolve(__dirname, "src/js")],
      use: {
        loader: "babel-loader",
        options: {presets: ["es2015"]}
      }
    }, { // convert sass to css
      test: /\.(sass|scss)$/,
      include: [path.resolve(__dirname, "src/css")],
      use: ["style-loader", "css-loader", "sass-loader"]
    }, { // copy static html and favicon
      test: /\.(html|ico)$/,
      include: [path.resolve(__dirname, "src")],
      use: ["file-loader?name=[path][name].[ext]"]
    }]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor" // specify the common bundle name
    })
  ],
  devServer: { // development server
    contentBase: path.resolve(__dirname, "dist"),
    compress: true, // enable gzip compression
    port: 3001
  }
};
module.exports = config;
