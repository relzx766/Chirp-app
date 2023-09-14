const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    //更改默认端口
    devServer: {
        open: false, // 自动打开浏览器
        port: 7878
    },
    outputDir: '../test-folder/',
    configureWebpack: {
        entry: './src/main.js',
        output: {
            filename: '[name].js',

        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: 'babel-loader'
                }
            ]
        }
    }
})
