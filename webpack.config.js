const path = require(`path`);

module.exports = {
  mode: `development`,
  devtool: `source-map`,
  entry: `./src/main.js`,
  output: {
    // eslint-disable-next-line no-undef
    path: path.join(__dirname, `public`),
    filename: `bundle.js`
  },
  devServer: {
    // eslint-disable-next-line no-undef
    contentBase: path.join(__dirname, `public`),
    publicPath: `http://localhost:8080/`,
    watchContentBase: true
  }
};
