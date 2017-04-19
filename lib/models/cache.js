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

const logger = require('../logger');

module.exports = class Cache {
	constructor() {
		this._store = new Map();
		this._cacheExpiryMS = 5000;
	}
	
	requests() {
		return [...this._store.values()].map(({request}) => {
			return request;
		});
	}
	
	matchOnce(request) {
		const found = this._store.get(request.url);
		if (found) {
			found.cancelExpiration();
			this._store.delete(request.url);
		}
		return found ? found.responsePromise : null;
	}
	
	add(request) {
		const url = request.url;
		logger.log(`Adding ${url} to the cache`);
		logger.time(`Prefetching ${url} took`);
		const responsePromise = fetch(request).then((response) => {
			logger.timeEnd(`Prefetching ${url} took`);
			return response;
		});
		
		const cancelExpiration = (() => {
			const timeoutId = setTimeout(() => {
				logger.warn(`${url} expired and was never used!`);
				this._store.delete(url);
			}, this._cacheExpiryMS);
			return () => {
				clearTimeout(timeoutId);
			};
		})();
		
		this._store.set(url, {
			request,
			responsePromise,
			cancelExpiration,
		});
	}
	
	addAll(requests) {
		requests.forEach((request) => {
			this.add(request);
		});
	}
};
