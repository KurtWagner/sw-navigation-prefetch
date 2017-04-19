'use strict';

/* eslint-env node */

const webpack = require('webpack');

module.exports = {
	devtool: 'source-map',
	entry: './lib/sw-navigation-prefetch.js',
	output: {
		filename: 'sw-navigation-prefetch.js',
		path: __dirname,
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: [/node_modules/],
			use: [{
				loader: 'babel-loader',
			}],
		}],
	},
	plugins: [
		new webpack.BannerPlugin(`
Copyright 2017 Kurt Wagner. All rights reserved

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
		`),
	],
};
