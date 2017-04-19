
# SW Navigation Prefetch

[![Build Status](https://travis-ci.org/KurtWagner/sw-navigation-prefetch.svg?branch=master)](https://travis-ci.org/KurtWagner/sw-navigation-prefetch) [![Dependency Status](https://david-dm.org/kurtwagner/sw-navigation-prefetch.svg)](https://david-dm.org/kurtwagner/sw-navigation-prefetch) [![devDependencies Status](https://david-dm.org/kurtwagner/sw-navigation-prefetch/dev-status.svg)](https://david-dm.org/kurtwagner/sw-navigation-prefetch?type=dev)

> **Important:** This is experimental. I built to learn more about service workers. There's no guarantee that it will operate as expected.

A library that prefetches resources at navigation run time to overcome startup code bloat blocking required fetches.

## When to use

If your application relies on ajax for first meaningful paint and has code that blocks these calls for the length or longer of the requests duration then this library may be for you.

## How it works

It will fetch the required requests while your code is processed so that by the time it needs the resources, they will be waiting and ready, reducing time until meaningful paint and UI jitter as required information populates the dom. For example,

```javascript 
navigationPrefetch.serveRoute('/', (request) => {
	const url = new URL(request.url);
	if (url.searchParams.has('id')) {
		const id = url.searchParams.get('id');
		return [
			`/api/jobs/${id}`,
			`/api/jobs/${id}/tasks`,
		];
	}
	return []; // prefetch nothing
});
```

When a user navigates to `/?id=120` it will start fetching `/api/jobs/120` and `/api/jobs/120/tasks` in the background. When your application requests for these resources, it will be given the prefetched promise.

## Demo

Start the demo with:

```
$ node demo/
```

Open the printed URL in a browser that supports service workers. Modify the query parameters to include an "id". e.g, `?id=10`. The demo has registered to make some relevant and irrelevant fetches on navigation. It simulates "code bloat" by blocking some requests.

## Development

Download dependencies

```
$ yarn install
```

Run linting and automated tests

```
$ yarn test
```

Run manual testing in browser

```
$ yarn run manual-test
```

Build library

```
$ yarn run build
```

## Debugging

To make noisy, enable debug mode with:
```javascript
navigationPrefetch.debug = true;
```

## License

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

