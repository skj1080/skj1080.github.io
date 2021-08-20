const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  mode: 'development',
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, 'dist')   
  },
  plugins: [   
    new webpack.DefinePlugin({
      DEPLOYED_ADDRESS: JSON.stringify(fs.readFileSync('deployedAddress', 'utf8').replace(/\n|\r/g, "")),
      DEPLOYED_ABI: fs.existsSync('deployedABI') && fs.readFileSync('deployedABI', 'utf8'),
      DEPLOYED_ADDRESS_MANAGE: JSON.stringify(fs.readFileSync('deployedAddress_manage', 'utf8').replace(/\n|\r/g, "")),
      DEPLOYED_ABI_MANAGE: fs.existsSync('deployedABI_manage') && fs.readFileSync('deployedABI_manage', 'utf8'),
    }),
    new CopyWebpackPlugin([{ from: "./src/index.html", to: "index.html"}])
  ],
  
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true }
}