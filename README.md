# CCP555 NSA course - fragments API

This guide outlines setting up a Node.js-based REST API using Express for the CCP555 NSA course. The API, Fragments, is developed using best practices for logging, code formatting, and linting. The guide walks through Git usage, setting up the development environment, and configuring tools like Prettier, ESLint, and structured logging with Pino.

## Git Command
- Avoid using `git add .`, it will add files and folders you don't expect.
- `git status` to see which files changed

## Run Server
- To run server, use command: `node src/server.js`
- Access the application in a browser: `http://localhost:8080`

## Structure and Route Information
```bash
fragements/
├── .vscode/
│   ├── launch.json    # To connect a debugger     
│   ├── settings.json  # Sepcific settings       
├── node_modules/
├── src/
│   ├── app.js         # Express app configuration
│   ├── server.js      # Server entry point
│   ├── logger.js      # Logger utility
├── .gitignore         # Ignore unnecessary files for git
├── .prettierignore    # Ignore unnecessary files for prettier
├── .prettierrc
├── eslint.config.mjs  # ESLint configuration
├── package-lock.json  # Package version lock file
├── package.json       # Project metadata and dependencies
└── README.md          # Project documentation
```
## Getting Started
### Prerequisites
Confirm version is up-to-date
- [Node.js](https://nodejs.org/en)
- [VSCode](https://code.visualstudio.com/)
  * [ESLint](https://eslint.org/docs/latest/use/getting-started)
  * [Prettier](https://prettier.io/)
  * Code Spell Checker
- [git](https://git-scm.com/downloads)
  * cli
- [curl](https://curl.se/)
  * [jq](https://jqlang.github.io/jq/tutorial/)
- Extra tools for Windows
  * [WSL2](https://www.windowscentral.com/how-install-wsl2-windows-10)
  * [Windows Terminal](https://www.microsoft.com/en-ca/p/windows-terminal/9n0dx20hk701#activetab=pivot:overviewtab)

### Installing
#### API Server
We create node.js based REST API using [Express](https://expressjs.com/)
1. Create 
  - a PRIVATE Github repo named `fragments` 
  - Description, 
  - README, 
  - .gitignore for node,
2. Invite your professor to this repo
3. Clone to local machine
```sh
git clone git@github.com:swang308/fragments.git
```
4. Open a terminal and cd to your cloned repo
  - cd fragments

#### npm
##### package.json
1. Create a `package.json`
```sh
npm init -y
```
> `-y` will answer yes to all questions
2. Open entire project in VSCode
```sh
code .
```
3. Modify `package.json`
  - version: 0.0.1
  - private: true
  - license: UNLICENSED
  - author: student name
  - description
  - repository's url
4. Remove unneeded keys
5. Example
```json
{
  "name": "fragments",
  "private": true,
  "version": "0.0.1",
  "description": "Fragments back-end API",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/swang308/fragments.git"
  },
  "author": "Shan-Yun, Wang",
  "license": "UNLICENSED"
}
```
6. Validate
  - In terminal, run `npm stall`
  - Fix errors if it generates
> When running `npm install`, it creates a `package-lock.json`
7. Commit files `package.json` and `package-lock.json`
```sh
git add package.json package-lock.json
git commit -m "Initial npm setup"
```

#### Prettier
1. Install and configure, installing as a Development Dependency([prettier](https://prettier.io/) should be installed with an exact version)
```sh
npm install --save-dev --save-exact prettier
```
2. Create a `.prettierrc` file, using following configuration
```json
{
  "arrowParens": "always",
  "bracketSpacing": true,
  "embeddedLanguageFormatting": "auto",
  "endOfLine": "lf",
  "insertPragma": false,
  "proseWrap": "preserve",
  "requirePragma": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "useTabs": false,
  "printWidth": 100
}
```
3. Create a `.prettierignore` file, this tells Prettier which files and floder to ignore when formatting, in this project, we don't want to format code in `node_modules/` or alter `package.json` or `package-lock.json`:
```
node_modules/
package.json
package-lock.json
```
4. Install [Prettier - Code Formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) VSCode extension
5. Create a folder name `.vscode/` in the root of project
6. Add a `settings.json` file to it, these settings will override VSCode works when working on this project but not affect other projects:
```json
{
  "editor.insertSpaces": true,
  "editor.tabSize": 2,
  "editor.detectIndentation": false,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "files.eol": "\n",
  "files.insertFinalNewline": true
}
```
7. Save and commit
```sh
git add package.json package-lock.json .prettierignore .prettierrc .vscode/settings.json
git commit -m "Add prettier"
```
#### ESLint
1. Open terminal, setup [ESLint](https://eslint.org/docs/user-guide/getting-started), run `npm audit fix` if you have vulnerabilities
```
npm init @eslint/config@latest
Need to install the following packages:
@eslint/create-config@1.3.1

✔ How would you like to use ESLint? · problems
✔ What type of modules does your project use? · commonjs
✔ Which framework does your project use? · none
✔ Does your project use TypeScript? · javascript
✔ Where does your code run? · node

eslint, globals, @eslint/js
✔ Would you like to install them now? · No / Yes
✔ Which package manager do you want to use? · npm
☕️Installing...

added 8 packages, removed 11 packages, changed 12 packages, and audited 224 packages in 2s

34 packages are looking for funding
  run `npm fund` for details

2 vulnerabilities (1 moderate, 1 high)

To address all issues, run:
  npm audit fix

Run `npm audit` for details.
Successfully created /Users/humphd/Documents/Seneca/CCP555 DPS955/Fall 2024/fragments/eslint.config.mjs file.
```

This will create an Eslint config file `eslint.cofig.mjs`, example:
```js
import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
];
```
> NOTE: the .mjs extension vs .js indicates to node.js that this is an ES6 Module.

2. Install the [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) VSCode extenstion.
3. In `package.json` file, add a `lint` script. to run ESLint from command line
```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "lint": "eslint \"./src/**/*.js\""
},
```
> We will have `src/` folder later
4. See which files changed then `add` and `commit` to git.
```sh
git status

git add eslint.config.mjs package-lock.json package.json
git commit -m "Add eslint"
``` 
#### Structured Logging and Pino
1. Create a `src/` folder to store all source code
```sh
mkdir src
```
2. Use proper Structured Logging in cloud enviroment, with JSON formatted strings. We use [Pino](https://getpino.io/#/):
```sh
npm install --save pino pino-pretty pino-http
```
> `--save` to have dependencies added to `package.json` automatically
3. Create and configure a Pino [Logger](https://getpino.io/#/docs/api?id=logger) instance, in `scr/logger.js`
```js
// src/logger.js

// Use `info` as our standard log level if not specified
const options = { level: process.env.LOG_LEVEL || 'info' };

// If we're doing `debug` logging, make the logs easier to read
if (options.level === 'debug') {
  // https://github.com/pinojs/pino-pretty
  options.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  };
}

// Create and export a Pino Logger instance:
// https://getpino.io/#/docs/api?id=logger
module.exports = require('pino')(options);
```
4. See which files changed then `add` and `commit` to git.
```sh
git status

git add eslint.config.mjs package-lock.json package.json
git commit -m "Add eslint"
```
#### Express App
1. Install packages necessary for [Express app](https://expressjs.com/)
```sh
npm install --save express cors helmet compression
```
2. Create a `app.js` file put in `src/` to define [Eepress app](https://expressjs.com/). This file will
  * create an `app` instance
  * attach various [middleware](https://expressjs.com/en/guide/using-middleware.html) functions for all routes
  * define our HTTPS route
  * add middleware for dealing with 404s
  * add [error-handling middleware](https://expressjs.com/en/guide/using-middleware.html#middleware.error-handling)
3. Example
```js
// src/app.js

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

// author and version from our package.json file
// TODO: make sure you have updated your name in the `author` section
const { author, version } = require('../package.json');

const logger = require('./logger');
const pino = require('pino-http')({
  // Use our default logger instance, which is already configured
  logger,
});

// Create an express app instance we can use to attach middleware and HTTP routes
const app = express();

// Use pino logging middleware
app.use(pino);

// Use helmetjs security middleware
app.use(helmet());

// Use CORS middleware so we can make requests across origins
app.use(cors());

// Use gzip/deflate compression middleware
app.use(compression());

// Define a simple health check route. If the server is running
// we'll respond with a 200 OK.  If not, the server isn't healthy.
app.get('/', (req, res) => {
  // Clients shouldn't cache this response (always request it fresh)
  // See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching#controlling_caching
  res.setHeader('Cache-Control', 'no-cache');

  // Send a 200 'OK' response with info about our repo
  res.status(200).json({
    status: 'ok',
    author,
    // TODO: change this to use your GitHub username!
    githubUrl: 'https://github.com/REPLACE_WITH_YOUR_GITHUB_USERNAME/fragments',
    version,
  });
});

// Add 404 middleware to handle any requests for resources that can't be found
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    error: {
      message: 'not found',
      code: 404,
    },
  });
});

// Add error-handling middleware to deal with anything else
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // We may already have an error response we can use, but if not,
  // use a generic `500` server error and message.
  const status = err.status || 500;
  const message = err.message || 'unable to process request';

  // If this is a server error, log something so we can see what's going on.
  if (status > 499) {
    logger.error({ err }, `Error processing request`);
  }

  res.status(status).json({
    status: 'error',
    error: {
      message,
      code: status,
    },
  });
});

// Export our `app` so we can access it in server.js
module.exports = app;
```

#### Express Server
1. Install [stoppable](https://www.npmjs.com/package/stoppable) package to allow our server to exit
```sh
npm install --save stoppable
```
2. Create a `server.js` in `src/`
```js
// src/server.js

// We want to gracefully shutdown our server
const stoppable = require('stoppable');

// Get our logger instance
const logger = require('./logger');

// Get our express app instance
const app = require('./app');

// Get the desired port from the process' environment. Default to `8080`
const port = parseInt(process.env.PORT || '8080', 10);

// Start a server listening on this port
const server = stoppable(
  app.listen(port, () => {
    // Log a message that the server has started, and which port it's using.
    logger.info(`Server started on port ${port}`);
  })
);
// Export our server instance so other parts of our code can access it if necessary.
module.exports = server;
```
3. Run `eslint` and ensure no errors
```sh
npm run lint
```
4. Test and run the server manually
```sh
node src/server.js
```
5. Try browsing [http://localhost:8080](http://localhost:8080/), a JSON health check response
6. Open another terminal and run
```sh
curl http://localhost:8080
```
7. Confirm the `author` and `githubUrl` is correct for your account.
```sh
 curl localhost:8080
{"status":"ok","author":"Shan-Yun, Wang","githubUrl":"https://github.com/swang308/fragments","version":"0.0.1"}
```
8. Intsall `jq` and pipe the CURL, which will pretty-print the JSON
```sh
curl -s localhost:8080 | jq
```
> the -s option [silences](https://everything.curl.dev/usingcurl/verbose#silence) the usual output to CURL, only sending the response from the server to jq
Output:
```sh
{
  "status": "ok",
  "author": "Shan-Yun, Wang",
  "githubUrl": "https://github.com/swang308/fragments",
  "version": "0.0.1"
}
```
9. Confirm your server id sending the right HTTP header, open the [Dev Tools and Network Tab](https://developer.chrome.com/docs/devtools/network/reference/#headers), look for `Cache-Control` and `Access-Control-Allow-Origin`, run CURL with [-i](https://curl.se/docs/manpage.html#-i) flag:
```sh
curl -i localhost:8080
```
Output:
```sh
HTTP/1.1 200 OK
Content-Security-Policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Origin-Agent-Cluster: ?1
Referrer-Policy: no-referrer
Strict-Transport-Security: max-age=15552000; includeSubDomains
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Frame-Options: SAMEORIGIN
X-Permitted-Cross-Domain-Policies: none
X-XSS-Protection: 0
Access-Control-Allow-Origin: *
Cache-Control: no-cache
Content-Type: application/json; charset=utf-8
Content-Length: 110
ETag: W/"6e-Ic45VDs+Y8k98Qsp2i/KcS0SwjI"
Vary: Accept-Encoding
Date: Sun, 08 Sep 2024 21:06:39 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"status":"ok","author":"Shanyun, Wang","githubUrl":"https://github.com/swang308/fragments","version":"0.0.1"}%  
```
10. See which files changed then `add` and `commit` to git.
```sh
git status

git add eslint.config.mjs package-lock.json package.json
git commit -m "Add eslint"
```

#### Server Startup Scripts
1. Install [nodemon](https://nodemon.io/) package, it helps automatically reload our server whenever the code changes
```sh
npm install --save-dev nodemon
```
2. In `package.json` file, add npm scripts
  * `start`: run our server normally
  * `dev`: run it via `nodemon`, it watches `src/**` folder for any changes and restart server whenever something is updated
  * `debug`: same as `dev` but start the `node inspector` on pirt `9229`, so we can attach a debugger
```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "lint": "eslint \"./src/**/*.js\"",
  "start": "node src/server.js",
  "dev": "LOG_LEVEL=debug nodemon ./src/server.js --watch src",
  "debug": "LOG_LEVEL=debug nodemon --inspect=0.0.0.0:9229 ./src/server.js --watch src"
},
```
3. To start server, run:
```sh
npm start
npm run dev
npm run debug
```
4. Set up a `.vscode/launch.json`:
```js
// .vscode/launch.json
{
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    // Start the app and attach the debugger
    {
      "name": "Debug via npm run debug",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run-script", "debug"],
      "skipFiles": ["<node_internals>/**"],
      "type": "node"
    }
  ]
}
```
5. Try to set a breakpoint in `src/app.js` and start the server via `VSCode` debugger.
6. See which files changed then `add` and `commit` to git.
```sh
git status

git add eslint.config.mjs package-lock.json package.json
git commit -m "Add eslint"
```

## Student Information
- Student Name: Shanyun, Wang
- Student ID: 133159228

## Version History
- 2024-09-09 v01
  * version 01 initial

## Acknowledgement
- [DiscussionBorad](https://github.com/humphd/cloud-computing-for-programmers-fall-2024/discussions)
- [Read more about how to configure eslint](https://eslint.org/docs/latest/use/configure/)
- [Use proper Structured Logging](https://developer.ibm.com/blogs/nodejs-reference-architectire-pino-for-logging/) 
- [npmjs](https://www.npmjs.com/)
- [Health Check](https://www.ibm.com/garage/method/practices/manage/health-check-apis/) to determine if the server is accepting requests
- [jq](https://jqlang.github.io/jq/tutorial/)
