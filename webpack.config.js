var path = require('path');
var VueLoaderPlugin = require('vue-loader/lib/plugin');
const utils = (path__) => {
    return path.resolve(__dirname, '..', path__)
}
module.exports = {
    mode: 'development', // production|development  // https://segmentfault.com/a/1190000013712229
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname, './lib'),
        publicPath: '/lib/',
        filename: 'pl-table.js',
        library: 'pl-table',
        libraryTarget: 'umd',
        libraryExport: 'default',
        umdNamedDefine: true,
        // globalObject: `(typeof self !== 'undefined' ? self : this)`, // https://stackoverflow.com/questions/49111086/webpack-4-universal-library-target
        globalObject: 'typeof self !== \'undefined\' ? self : this' // element-ui 写法
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader'
        }, {
            test: /\.css$/,
            loader: 'css-loader'
        }, {
            test: /\.less$/,
            loader: 'style-loader!css-loader!less-loader'
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: file => /node_modules/.test(file) && !/src/.test(file)
        }]
    },
    devtool: "source-map",
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
        alias: {
            // 'vue$': 'vue/dist/vue.esm.js',
            '@': utils('src'),
            'vue': 'vue/dist/vue.js'
        }
    },
    plugins: [
        new VueLoaderPlugin()
    ]
}
