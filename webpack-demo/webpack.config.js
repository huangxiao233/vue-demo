const path = require('path');

const webpack = require('webpack');
module.exports = {
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),  
        filename: 'bundle.js'
    },
    module: {
      // 不可以写成path
      rules:[
        {
          test: /\.js[x]?$/,
          exclude: /node_modules/,
          loader: 'babel-loader?presets[]=es2015&presets[]=react'
        },
      ]
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.common.js'
      }
    }
  }