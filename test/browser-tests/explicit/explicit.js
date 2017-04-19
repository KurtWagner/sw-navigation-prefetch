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

/* eslint-disable max-len, no-console */

const activateSW = window.navFetchTestHelpers.activateSW;

describe('Test navigation prefetch', function() {	
	it('should use navigation prefetched resource first', function() {
		let iframe;
		return activateSW('/test/browser-tests/explicit/sw.js')
		.then((newIframe) => {
			iframe = newIframe;
			return iframe.contentWindow.fetch('/api/car/10');
		})
		.then((response) => {
			response.status.should.equal(200);
			response.headers.get('sw-navigation-was-prefetched').should.equal('true');
			return response.text();
		})
		.then((responseText) => {
			responseText.should.equal('car #10');
			return iframe.contentWindow.fetch('/api/car/10');
		})
		.then((response) => {
			response.status.should.equal(200);
			response.headers.get('sw-navigation-was-prefetched').should.equal('false');
		});
	});
	it('should only use navigation prefetched resource if registered', function() {
		let iframe;
		return activateSW('/test/browser-tests/explicit/sw.js')
		.then((newIframe) => {
			iframe = newIframe;
			return iframe.contentWindow.fetch('/api/bike/1000');
		})
		.then((response) => {
			response.status.should.equal(200);
			response.headers.get('sw-navigation-was-prefetched').should.equal('false');
			return response.text();
		})
		.then((responseText) => {
			responseText.should.equal('bike #1000');
		});
	});
	it('should handle multiple prefetched resources', function() {
		let iframe;
		return activateSW('/test/browser-tests/explicit/sw.js')
		.then((newIframe) => {
			iframe = newIframe;
			return iframe.contentWindow.fetch('/api/bus/100');
		})
		.then((response) => {
			response.status.should.equal(200);
			response.headers.get('sw-navigation-was-prefetched').should.equal('true');
			return response.text();
		})
		.then((responseText) => {
			responseText.should.equal('bus #100');
		});
	});
});
