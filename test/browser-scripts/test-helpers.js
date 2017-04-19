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

(function(navFetchTestHelpers) {
	'use strict';

	navFetchTestHelpers.activateSW = activateSW;
	
	if (!window.goog && !window.goog.swUtils) {
		throw new Error(`Requires sw-testing-helpers/build/browser/sw-utils.js`);
	}
	
	function activateSW(swUrl) {
		const swUtils = window.goog.swUtils;

		return swUtils
		.activateSW(swUrl)
		.then((iframe) => {
			return new Promise((resolve) => {
				// we're reloading the iframe so that the service worker is installed
				// and ready to serve some fetch responses that we've prepared
				iframe.addEventListener('load', () => {
					resolve(iframe);
				});
				// iframe.contentWindow.location.reload(/* forceReload: */ true);
				// force reload so we have the service worker. Using location.reload
				// did not work in firefox.
				iframe.contentWindow.location.href += '?reload=1';
			});
		});
	}
})(window.navFetchTestHelpers = window.navFetchTestHelpers || {});
