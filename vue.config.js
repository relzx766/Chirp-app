const {defineConfig} = require('@vue/cli-service');

module.exports = defineConfig({
    transpileDependencies: true,
    // 更改默认端口
    devServer: {
        open: false, // 自动打开浏览器
        port: 7878
    },
    outputDir: '../test-folder/',
    configureWebpack: {
        entry: './src/main.js',
        output: {
            filename: '[name].js',
        }
    },
    chainWebpack: config => {
        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap(options => {
                options.compilerOptions.directives = {
                    html(node, directiveMeta) {
                        (node.props || (node.props = [])).push({
                            name: "innerHTML",
                            value: `xss(_s(${directiveMeta.value}))`
                        });
                    }
                };
                return options;
            });
    }
});
