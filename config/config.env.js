const {resolve} = require("./utils");
const webpackEnv = process.env.NODE_ENV;
const isEnvDevelopment = webpackEnv === "development";
const isEnvProduction = webpackEnv === "production";
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";

module.exports = {
    isEnvDevelopment,
    isEnvProduction,
    shouldUseSourceMap,
    appBuild: resolve("dist"),
    appStatic: resolve("src", "static"),
    appHtml: resolve("src", "index.html"),
    appIndexJs: resolve("src", "index"),
    appSrc: resolve("src"),
    publicPath: "/"
};