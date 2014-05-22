module.exports = {
  entry: "./js/index.js",
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  devtool: "#source-map",
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: "source-map-loader"
      }
    ],
    loaders: [
      { test: /\.png/, loader: 'url' }
    ]
  }
};
