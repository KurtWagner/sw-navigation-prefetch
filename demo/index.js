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

/* eslint-env node */

const express = require('express');
const path = require('path');

const app = express();

app.use('/', express.static(path.resolve(__dirname, '..')));

app.get('/sw.js', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'sw.js'));
});
app.get('/', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.get('/car/:id', function(req, res) {
	setTimeout(() => {
		res.send(`car #${req.params.id}`);
	}, 100);
});
app.get('/boat/:id', function(req, res) {
	setTimeout(() => {
		res.send(`boat #${req.params.id}`);
	}, 200);
});
app.get('/bus/:id', function(req, res) {
	setTimeout(() => {
		res.send(`bus #${req.params.id}`);
	}, 400);
});
app.get('/cat/:id', function(req, res) {
	setTimeout(() => {
		res.send(`cat #${req.params.id}`);
	}, 800);
});

const port = 3000;
app.listen(port, () => {
	console.log(`Example app listening on port http://localhost:${port}!`);
});
