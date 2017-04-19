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

const expInHours = 24;
const seleniumAssistant = require('selenium-assistant');

console.log('Started downloading browsers.');
Promise.all([
	seleniumAssistant.downloadLocalBrowser('chrome', 'stable', expInHours),
	seleniumAssistant.downloadLocalBrowser('chrome', 'beta', expInHours),
	seleniumAssistant.downloadLocalBrowser('chrome', 'unstable', expInHours),
	seleniumAssistant.downloadLocalBrowser('firefox', 'stable', expInHours),
	seleniumAssistant.downloadLocalBrowser('firefox', 'beta', expInHours),
	seleniumAssistant.downloadLocalBrowser('firefox', 'unstable', expInHours),
])
.then(() => {
	console.log('Finished downloaded browsers.');
})
.catch(() => {
	console.log('Failed to download browsers.');
});
