const path = require("path");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const {resolve} = require("./utils");
const env = require("./config.env");
const {isEnvProduction, isEnvDevelopment, shouldUseSourceMap} = env;

function generateStyleLoaders(preProcessor = "css-loader", options = {})
{
    const cssOptions = Object.assign({
        modules: Boolean(options.modules),
        isEnvDevelopment: Boolean(options.isEnvDevelopment),
        isEnvProduction: Boolean(options.isEnvProduction),
        shouldUseSourceMap: Boolean(options.shouldUseSourceMap)
    }, options);

    const {isEnvProduction, modules, shouldUseSourceMap} = cssOptions;
    const sourceMap = shouldUseSourceMap;
    const type = preProcessor.match(/(.*)-(.*)/)[1];
    const loader = `${type === "scss" ? "sass" : type}-loader`;

    return [!isEnvProduction && {
        loader: "style-loader",
        options: {
            sourceMap
        }
    }, isEnvProduction && {
        loader: require("mini-css-extract-plugin").loader
    }, {
        loader: "css-loader",
        options: Object.assign({
            sourceMap
        }, modules ? {
            modules: true
        } : undefined)
    }, {
        loader: require.resolve("postcss-loader"),
        options: {
            ident: "postcss",
            plugins: () => [require("autoprefixer")()],
            sourceMap
        }
    }, (Boolean(preProcessor) && !["css-loader", "style-loader"].includes(loader)) && {
        loader: loader,
        options: {
            sourceMap
        }
    }].filter(Boolean);
}

function outputPublicPath(name, ...relativePaths)
{
    return [relativePaths, isEnvProduction ? `${name}` : `[name].${name}`].join("/");
}

module.exports = {
    devtool: function (options = {})
    {
        const {isEnvProduction, isEnvDevelopment, shouldUseSourceMap} = options;
        if (isEnvProduction)
        {
            return Boolean(shouldUseSourceMap) ? "source-map" : false
        }
        return Boolean(isEnvDevelopment) && "cheap-module-source-map";
    }(env),
    mode: isEnvProduction ? "production" : isEnvDevelopment && "development",
    performance: {
        hints: false
    },
    optimization: {
        minimize: isEnvProduction,
        minimizer: isEnvDevelopment ? [] : [
            new UglifyJsPlugin({
                uglifyOptions: {
                    warnings: false,
                    parse: {},
                    compress: false,
                    mangle: true,
                    output: null,
                    toplevel: false,
                    nameCache: null,
                    ie8: true,
                    keep_fnames: false
                },
                sourceMap: shouldUseSourceMap
            }),
            new OptimizeCSSAssetsPlugin()
        ]
    },
    entry: {
        "console-polyfill": "console-polyfill",
        "babel-polyfill": "@babel/polyfill",
        main: [env.appIndexJs]
    },
    output: {
        publicPath: env.publicPath,
        path: env.appBuild,
        filename: outputPublicPath("[name].[hash].js", "scripts")
    },
    resolve: {
        extensions: [".js", ".json"],
        alias: {
            "@": env.appSrc,
            "react": "anujs/dist/ReactIE",
            "react-dom": "anujs/dist/ReactIE",
            "prop-types": "anujs/lib/ReactPropTypes",
            "create-react-class": "anujs/lib/createClass",
            "react-tap-event-plugin": "anujs/lib/injectTapEventPlugin"
        }
    },
    devServer: {
        contentBase: env.appBuild,
        historyApiFallback: true,
        disableHostCheck: true
    },
    module: {
        rules: [{
            test: /\.js$/i,
            loader: "babel-loader",
            include: [env.appSrc, resolve("test"), resolve("node_modules", "webpack-dev-server", "client")]
        }, {
            test: /\.module\.css$/i,
            use: generateStyleLoaders("css-loader", {...env, modules: true})
        }, {
            test: /\.css$/i,
            exclude: /\.module\.css$/i,
            use: generateStyleLoaders("css-loader", env)
        }, {
            test: /\.module\.(less)$/i,
            use: generateStyleLoaders("less-loader", {...env, modules: true})
        }, {
            test: /\.less$/i,
            exclude: /\.module\.(less)$/i,
            use: generateStyleLoaders("less-loader", env)
        }, {
            test: /\.(png|jpe?g|gif|eot|svg|bmp|webp)(\?.*)?$/i,
            use: [{
                loader: "url-loader",
                options: {
                    limit: 8192,
                    name: outputPublicPath("[hash].[ext]", "images")
                }
            }]
        }, {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i,
            use: [{
                loader: "url-loader",
                options: {
                    limit: 10240,
                    name: outputPublicPath("[hash].[ext]", "media")
                }
            }]
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
            use: [{
                loader: "url-loader",
                options: {
                    limit: 10240,
                    name: outputPublicPath("[hash].[ext]", "assets")
                }
            }]
        }]
    },
    plugins: [
        isEnvProduction && new CleanWebpackPlugin(),
        isEnvProduction && new MiniCssExtractPlugin({
            filename: outputPublicPath("[hash].css", "stylesheet")
        }), new HtmlWebpackPlugin({
            template: env.appHtml,
            favicon: path.join(env.appSrc, "favicon.ico"),
            minify: false,
            hash: true,
            inject: true,
            chunks: ["console-polyfill", "babel-polyfill", "main"],
            chunksSortMode: "manual"
        }), new CopyWebpackPlugin([{
            from: env.appStatic,
            to: path.join(env.appBuild, "static"),
            toType: "dir",
            ignore: [".gitkeep"]
        }])
    ].filter(Boolean)
};