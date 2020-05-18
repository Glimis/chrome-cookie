var path = require('path');

const VueLoaderPlugin = require('vue-loader/lib/plugin')  

module.exports = {
    mode:'development',
    devtool:'inline-cheap-module-source-map',
    entry:  path.resolve(__dirname,'./index.js'),
    entry:{
        content:path.resolve(__dirname,'./content/index.js'),
        background:path.resolve(__dirname,'./background/index.js'),
        popup:path.resolve(__dirname,'./popup/index.js')
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.tpl$/i,
          use: [
            'raw-loader'
          ]
        },        {
          test:/\.vue$/,
          loader:'vue-loader'
      },{
        test: /\.less$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'less-loader'
        ]
      }
      ]
    },
    plugins: [
      new VueLoaderPlugin()
    ]
};