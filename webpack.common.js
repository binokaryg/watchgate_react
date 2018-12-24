const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		app: './src/index.js'
	},
	plugins: [
		new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin({
			title: 'Watchgate',
			template: __dirname + '/src/index.html'
		})
	],
	output: {
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/',
		filename: '[name].js'
	},
	module: {
		rules: [{
				test: /\.jsx?$/,
				exclude: /node_modules\/(?!(mongodb-extjson|bson))/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015', 'react']
				}
			}, {
				test: /\.scss$/,
				loaders: ['style-loader', 'css-loader', 'resolve-url-loader', 'sass-loader?sourceMap']
			}
		]
	}
	};
