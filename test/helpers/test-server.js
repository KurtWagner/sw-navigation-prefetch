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
/* eslint-env node */

module.exports = {
	startServer: startServer,
	stopServer: stopServer,
};

const TestServer = require('sw-testing-helpers').TestServer;
const testServer = new TestServer();

function startServer(serverPath, serverPort) {
	return testServer
	.startServer(serverPath, serverPort)
	.then((portNumber) => {
		// Basic mocked API that we will "prefetch". It supports a bunch any
		// object type and identifier. e.g, "GET /api/car/10" or "GET /api/bus/100".
		const app = testServer.getExpressApp();
		app.get('/view', function(req, res) {
			res.send('View page');
		});
		app.get('/api/:type/:id', function(req, res) {
			// Requests that are prefetched have the following header set 
			// to true. We're going to forward this value onwards so that
			// tests can confirm whether a request did infact originate 
			// from a prefetched request.
			if (req.header('sw-navigation-prefetch') === 'true') {
				res.setHeader('sw-navigation-was-prefetched', 'true');
			} else {
				res.setHeader('sw-navigation-was-prefetched', 'false');
			}
			
			res.send(`${req.params.type} #${req.params.id}`);
		});
		
		// tests seem to want this to control the iframe, I'm not sure why
		// it's not built into the test servers source.
		app.get('/test/iframe/:timestamp', function(req, res) {
			res.send(`I'm an iframe used for testing :)`);
		});
		
		return `http://localhost:${portNumber}`;
	});
}

function stopServer() {
	testServer.killServer();
}
