var webpack = require("webpack");
var path = require("path");
var config = {
  context: path.resolve(__dirname, "src"),
  entry: {
    // main entry point to application
    main: "./app/main.js",
    // entry point for third-party libraries
    vendor: "./vendor/vendor.js"
  },
  output: { // path to separate output bundles
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[name].js"
  },
  watch: true, // rebuild when file changes
  module: {
    rules: [{ // allows to use ES 2015 features
      test: /\.js$/,
      // don't parse node_modules and vendor libraries
      exclude: [/node_modules/, path.resolve(__dirname, "src/vendor")],
      use: {
        loader: "babel-loader",
        options: {presets: ["es2015"]}
      }
    }, { // convert sass to css
      test: /\.(sass|scss)$/,
      use: ["style-loader", "css-loader", "sass-loader"]
    }, { // import regular css
      test: /\.css$/, // wherever they are
      use: ["style-loader", "css-loader"]
    }, { // copy static html and favicon
      test: /\.(html|ico)$/,
      // maybe unnecessary to write rules only for two files?
      include: [
        path.resolve(__dirname, "src/index.html"),
        path.resolve(__dirname, "src/favicon.ico")
      ],
      // nevertheless we just need to copy them
      use: ["file-loader?name=[path][name].[ext]"]
    }, { // any other html process as raw text for angular templates
      test: /\.(html|txt)$/,
      exclude: [path.resolve(__dirname, "src/index.html")], // just in case
      use: ["raw-loader"]
    }]
  },
  plugins: [
    // optimize modules separation with plugin
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor" // specify the common bundle's name
    })
  ],
  devServer: { // development server
    contentBase: path.resolve(__dirname, "dist"),
    compress: true, // enable gzip compression
    port: 3001
  }
};
module.exports = config;
