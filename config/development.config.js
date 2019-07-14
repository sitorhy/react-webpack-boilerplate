const merge = require("webpack-merge");

module.exports = merge(require("./webpack.config"), {
    devServer: {
        port: 8080,
        host: "localhost",
        open: true,
        proxy: {
            "/ajax": {
                target: "http://www.w3school.com.cn",
                changeOrigin: true
            }
        }
    }
});