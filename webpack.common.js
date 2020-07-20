const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	entry: {
		app: './src/index.js'
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			title: 'Watchgate',
			template: __dirname + '/src/index.html'
		}),
		new webpack.DefinePlugin({
			WATCHGATE_APP_ID: JSON.stringify(process.env.WATCHGATE_APP_ID)
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
				presets: ['@babel/preset-env', '@babel/preset-react'],
				plugins: ['@babel/plugin-proposal-class-properties']
			}
		}, {
			test: /\.scss$/,
			loaders: ['style-loader', 'css-loader', 'resolve-url-loader', 'sass-loader?sourceMap']
		}
		]
	}
};
