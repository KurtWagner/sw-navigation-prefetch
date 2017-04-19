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

/* eslint-disable max-len, no-invalid-this */
/* eslint-env node, mocha */

const path = require('path');
const seleniumAssistant = require('selenium-assistant');
const getLocalBrowsers = require('./helpers/get-local-browsers').getLocalBrowsers;
const mochaUtils = require('sw-testing-helpers').mochaUtils;
const TestServer = require('./helpers/test-server'); 

require('geckodriver');
require('chromedriver');

require('chai').should();

describe('Test sw-navigation-prefetch', function() {
	// Selenium flakiness
	this.retries(5);
	
	// Browser can be slow
	this.timeout(60 * 1000);
	
	let seleniumDriver = null;
	let testServerURL;
	
	before(() => {
		return TestServer
		.startServer(path.join(__dirname, '..'))
		.then((url) => {
			testServerURL = url;
		});
	});
	
	after(() => {
		TestServer.stopServer();
	});
	
	afterEach(function() {
		// We'll give selenium time to close the browser
		this.timeout(60 * 1000);
		
		return seleniumAssistant
		.killWebDriver(seleniumDriver)
		.then(() => {
			seleniumDriver = null;
		});
	});
	
	getLocalBrowsers().forEach((browserInfo) => {
		it(`should pass in ${browserInfo.getPrettyName()} (${browserInfo.getVersionNumber()})`, () => {
			return browserInfo.getSeleniumDriver().then((driver) => {
				seleniumDriver = driver;
				return mochaUtils.startWebDriverMochaTests(
					browserInfo.getPrettyName(),
					seleniumDriver,
					`${testServerURL}/test/browser-tests/`
				).then((testResults) => {
					mochaUtils.prettyPrintResults(testResults);
					if (testResults.failed.length > 0) {
						throw new Error('Tests Failed');
					}
				});
			});
		});
	});
});
