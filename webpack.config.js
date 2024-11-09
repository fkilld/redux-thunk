// webpack.config.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js', // Entry point
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js', // Output bundle
    clean: true, // Optional: cleans the output directory before emit
  },
  mode: 'development', // or 'production'
  module: {
    rules: [
      {
        test: /\.css$/, // For CSS files
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // HTML template
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Serve from 'dist' directory
    },
    port: 3000, // Development server port
    open: true, // Automatically open the browser
  },
}
