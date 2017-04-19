/*
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
*/

'use strict';

/* eslint-disable max-len */

const Route = require('./route');
const Cache = require('./cache');
const logger = require('../logger');

module.exports = class Prefetch {
	constructor({location}) {
		this._cache = new Cache();
		this._routes = [];
		this._location = location;
	}
	
	set debug(debug) {
		logger.debug = debug;
	}

	serveRoute(routePath, makeRequests) {
		const routeURL = new URL(routePath, this._location.origin);
		const route = new Route({
			routeURL,
			makeRequests,
		});
		this._routes.push(route);
	}

	provideRoutes(request) {
		const responsePromise = this._cache.matchOnce(request);
		if (responsePromise) {
			logger.log(`Using cache for ${request.url}`);
			return responsePromise.then((response) => {
				return response.clone();
			});
		}
		logger.log(`Using network for ${request.url}`);
	}

	prefetchRoutes(navigationRequest) {
		this._routes.forEach((route) => {
			if (route.matchesRequest(navigationRequest)) {
				const requests = route.makeRequests({navigationRequest});
				this._cache.addAll(requests);
			}
		});
	}
};
