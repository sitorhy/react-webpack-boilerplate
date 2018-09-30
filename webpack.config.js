const path=require("path");
const HtmlWebpackPlugin=require("html-webpack-plugin");
const ES3ifyWebpackPlugin=require("es3ify-webpack-plugin");
const ExtractTextWebpackPlugin=require("extract-text-webpack-plugin");
const CleanWebpackPlugin=require("clean-webpack-plugin");
const UglifyjsWebpackPlugin=require("uglifyjs-webpack-plugin");
const CopyWebpackPlugin=require("copy-webpack-plugin");

const Webpack=require("webpack");
const WebpackDevMiddleware=require("webpack-dev-middleware");
const WebpackHotMiddleware=require("webpack-hot-middleware");
const express=require("express");

const $_IS_DEBUG=process.env.NODE_ENV==="development";
const $_IS_WATCH_IE8=process.argv.findIndex(i=>i==="--env.ie8")>=0;
const $_IS_EXPRESS=process.argv.findIndex(i=>i==="--env.express")>=0;
const $_IS_HMR=process.argv.findIndex(i=>i==="--env.hmr")>=0;

const $_DEVELOPMENT_CONFIG=
	{
		devtool:"cheap-module-eval-source-map",
		compress:false,
		sourceMap:true,
		extractCSS:false,
		cssModules:true,
		buildPath:path.resolve("dist"),
		publicPath:"/",
		devServer:{
			contentBase:path.resolve("dist"),
			port:8099,
			host:"127.0.0.1",
			open:false
		}
	};

const $_PRODUCTION_CONFIG=
	{
		devtool:"source-map",
		compress:true,
		sourceMap:true,
		extractCSS:true,
		cssModules:true,
		buildPath:path.resolve("dist"),
		publicPath:"./"
	};

const $_IE8_WATCH_OPTIONS=
	{
		compress:false,
		sourceMap:false,
		extractCSS:false
	};

const $_STYLE_EXTRACTIONS=[];
const $_CONFIG=$_IS_DEBUG?$_DEVELOPMENT_CONFIG:($_IS_WATCH_IE8?Object.assign({},$_PRODUCTION_CONFIG,$_IE8_WATCH_OPTIONS):$_PRODUCTION_CONFIG);

function generateStyleLoader(lang="css",options={})
{
	let generateOptions=Object.assign({},{
		extract:false,
		sourceMap:false,
		compress:false,
		modules:false,
		localIdentName:"[path][name]---[local]---[hash:base64:5]",
		publicPath:"../",
		filename:`stylesheet/[name]-${lang}.[hash].css`
	},options);

	let styleLoader={
		loader:"style-loader",
		options:{
			sourceMap:generateOptions.sourceMap
		}
	};

	let cssLoader={
		loader:"css-loader",
		options:{
			sourceMap:generateOptions.sourceMap,
			minimize:generateOptions.compress,
			localIdentName:generateOptions.localIdentName,
			modules:generateOptions.modules
		}
	};

	let customLoader=null;
	if(lang!=="css")
	{
		customLoader={
			loader:`${lang}-loader`,
			options:{
				sourceMap:true
			}
		};
	}

	let loaders=[];
	if(!customLoader)
	{
		loaders.push(styleLoader,cssLoader);
	}
	else
	{
		loaders.push(styleLoader,cssLoader,{loader:"resolve-url-loader"},customLoader);
	}

	let test=generateOptions.test;
	if(!test)
	{
		test=new RegExp(`.(${lang})$`);
	}

	if(generateOptions.extract)
	{
		let extraction=new ExtractTextWebpackPlugin({
			filename:generateOptions.filename
		});

		$_STYLE_EXTRACTIONS.push(extraction);

		return {
			test,
			use:extraction.extract({
				fallback:styleLoader,
				use:loaders.slice(1),
				publicPath:generateOptions.publicPath
			})
		};
	}
	else
	{
		return {
			test,
			use:loaders
		};
	}
}

function generateStyleLoaders(lang="css",options={})
{
	if(options.modules)
	{
		const suffix=`.scope.${lang}`;
		const ext=`.${lang}`;
		return [generateStyleLoader(lang,{
			...options,test:function(path){
				return path.lastIndexOf(ext)===path.length-ext.length&&path.lastIndexOf(suffix)===path.length-suffix.length;
			},filename:`stylesheet/[name]-${lang}.scope.[hash].css`
		}),generateStyleLoader(lang,{
			...options,modules:false,test:function(path){
				return path.lastIndexOf(ext)===path.length-ext.length&&path.lastIndexOf(`.scope.${lang}`)<0;
			}
		})];
	}
	else
	{
		return [generateStyleLoader(lang,options)];
	}
}

const $_WEBPACK_CONFIG={
	devtool:$_CONFIG.devtool,
	entry:{
		"console-polyfill":"console-polyfill",
		"es5-shim":"es5-shim/es5-shim.js",
		"es5-sham":"es5-shim/es5-sham.js",
		"babel-polyfill":"babel-polyfill",
		main:[path.resolve("src","index.js")]
	},
	output:{
		path:$_CONFIG.buildPath,
		publicPath:$_CONFIG.publicPath,
		filename:"scripts/[name].js"
	},
	module:{
		rules:[
			{
				test:/\.(js|jsx)$/,
				loader:"babel-loader",
				exclude:/node_module/
			},
			{
				test:/\.(png|jpg|gif)$/i,
				use:[{
					loader:"url-loader",
					options:{
						limit:8192,
						name:"images/[name].[hash:8].[ext]"
					}
				}]
			},
			...generateStyleLoaders("css",{
				modules:$_CONFIG.cssModules,
				extract:$_CONFIG.extractCSS,
				sourceMap:$_CONFIG.sourceMap,
				compress:$_CONFIG.compress
			}),
			...generateStyleLoaders("less",{
				modules:$_CONFIG.cssModules,
				extract:$_CONFIG.extractCSS,
				sourceMap:$_CONFIG.sourceMap,
				compress:$_CONFIG.compress
			})
		]
	},
	resolve:{
		alias:{
			"react":"anujs/dist/ReactIE",
			"react-dom":"anujs/dist/ReactIE",
			"prop-types":"anujs/lib/ReactPropTypes",
			"create-react-class":"anujs/lib/createClass",
			"react-tap-event-plugin":"anujs/lib/injectTapEventPlugin"
		}
	},
	plugins:[
		new ES3ifyWebpackPlugin(),
		new HtmlWebpackPlugin(
			{
				template:path.join("src","index.html"),
				favicon:path.join("src","favicon.ico"),
				minify:false,
				hash:true,
				inject:true,
				chunks:["console-polyfill","es5-shim","es5-sham","babel-polyfill","main"],
				chunksSortMode:"manual"
			}),
		new CopyWebpackPlugin([
			{
				from:path.resolve("src","static"),
				to:path.join($_CONFIG.buildPath,"static"),
				toType:"dir",
				ignore:[".gitkeep"]
			}
		])
	].concat($_STYLE_EXTRACTIONS),
	devServer:$_DEVELOPMENT_CONFIG.devServer
};

if(!$_IS_DEBUG&& !$_IE8_WATCH_OPTIONS)
{
	$_WEBPACK_CONFIG.plugins.splice(0,0,new CleanWebpackPlugin(["dist"]));
}

if($_CONFIG.compress)
{
	$_WEBPACK_CONFIG.plugins.push(
		new UglifyjsWebpackPlugin({
			uglifyOptions:
				{
					ie8:true,
					mangle:{
						keep_classnames:true,
						keep_fnames:true,
						eval:false
					}
				},
			sourceMap:$_CONFIG.sourceMap,
		})
	);
}

if($_IS_EXPRESS)
{
	if($_IS_HMR)
	{
		const hotMiddlewareScript="webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true";
		$_WEBPACK_CONFIG.entry.main.splice(0,0,hotMiddlewareScript);
		$_WEBPACK_CONFIG.plugins.push(new Webpack.HotModuleReplacementPlugin());
	}

	const compiler=Webpack($_WEBPACK_CONFIG);
	const app=new express();

	app.use(WebpackDevMiddleware(compiler,{
		publicPath:$_WEBPACK_CONFIG.output.publicPath,
		quiet:false,
		reload:false
	}));

	if($_IS_HMR)
	{
		const hotMiddleware=WebpackHotMiddleware(compiler,{
			noInfo:true,
			publicPath:$_WEBPACK_CONFIG.output.publicPath
		});

		compiler.plugin("compilation",function(compilation){
			compilation.plugin("html-webpack-plugin-after-emit",function(data,cb){
				hotMiddleware.publish({action:"reload"});
				cb();
			})
		});

		app.use(hotMiddleware);
	}

	app.listen($_DEVELOPMENT_CONFIG.devServer.port,$_DEVELOPMENT_CONFIG.devServer.host,function(){
		console.log(`app server listening on ${$_DEVELOPMENT_CONFIG.devServer.host}:${$_DEVELOPMENT_CONFIG.devServer.port}`);
	});
}

module.exports=$_WEBPACK_CONFIG;