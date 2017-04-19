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

module.exports = class Route {
	constructor({routeURL, makeRequests}) {
		this._routeURL = routeURL;
		this._makeRequests = makeRequests;
	}
	
	makeRequests({navigationRequest}) {
		const requests = new Set();
		this._makeRequests(navigationRequest).forEach((rawUrl) => {
			const url = makeURL({
				urlOrPath: rawUrl,
				referrer: getReferrerFromRequest(navigationRequest),
			});
			requests.add(makeRequest(url));
		});
		return [...requests.values()];
	}
	
	/**
	 * Compare whether a given url is a match on the registered route. This is 
	 * used to determine whether a navigational request matches this registered
	 * request and should thus preload linked resources.
	 *
	 * @param {Request} request -
	 * @return {Boolean} true if request matches
	 */
	matchesRequest(request) {
		const requestURL = new URL(request.url);
		const routeURL = this._routeURL;
				
		// Registered route always expects navigational requests to be from
		// the same origin. If the given request is not, then simply ignore
		if (routeURL.origin !== requestURL.origin) {
			return false;
		}
		
		// The path is then compared. From there the request builder can do as
		// it pleases with the requests parameters.
		const pathToRegexp = require('path-to-regexp');
		const regex = pathToRegexp(routeURL.pathname);		
		return !!requestURL.pathname.match(regex);
	}
};

function makeURL({urlOrPath, referrer}) {
	if (!urlOrPath.startsWith('http')) {
		// if the given url does not start with http we're going to
		// assume it's a path relative to the origin of the worker
		return new URL(urlOrPath, referrer);
	}
	return new URL(urlOrPath);
}

function makeRequest(url) {
	const headers = new Headers();
	headers.append('sw-navigation-prefetch', 'true');
	
	return new Request(url, {
		headers: headers,
		credentials: 'include',
	});
}

function getReferrerFromRequest(request) {
	// if no referrer than assume it's a navigation mode, in which case the
	// originating url of the request is the actual referrer
	return request.referrer || request.url;
}
