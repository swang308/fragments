# CCP555 NSA course - fragments API
This guide outlines setting up a Node.js-based REST API using Express for the CCP555 NSA course. The API, Fragments, is developed using best practices for logging, code formatting, and linting. The guide walks through Git usage, setting up the development environment, and configuring tools like Prettier, ESLint, and structured logging with Pino.

## Git Command
- Avoid using `git add .`, it will add files and folders you don't expect.
- `git status` to see which files changed
- `git add ..` to add which files changed
- `git commit -m "What_change"` to leave comment to which files changed

## Run Server
- To run server, use command
  * `npm start`
> NOTE:`npm run dev`: for developer, and `npm run debug`: for debug
- Access the application in a browser
  * `http://localhost:8080`
- Run ESLint
  * npm run lint
- Run by `curl`
  * `curl http://localhost:8080`
  * jq and pipe the CURL, which will pretty-print the JSON
    - `curl -s localhost:8080 | jq`
  * Show Header
    - `curl -i localhost:8080`

## Test
- Run test in `watch` mode
  * npm run test:watch
- Run test of `get.test.js` in `watch` mode
  * npm run test:watch get.test.js
- Run test
  * npm test
- Run test of `get.test.js`
  * npm test get.test.js

## Continuous Integration (CI)
- You never leave CI in a **broken state**, the source tree must always stay **green**

## Structure and Route Information
```bash
fragements/
├── .aws/
│   ├── credentials       # Store your AWS credentials     
├── .github/
│   ├── workflows/
│   │  ├─ ci.yml          #  A workflow YAML file for our CI job
├── .vscode/
│   ├── launch.json       # To connect a debugger     
│   ├── settings.json     # Sepcific settings       
├── coverage/
├── node_modules/
├── src/
│   ├── auth/             # Define our Passport strategy and authentication
│   │  ├─ auth-middleware.js
│   │  ├─ basic-auth.js
│   │  ├─ cognito.js
│   │  ├─ index.js
│   ├── model/
│   │  ├── data/
│   │  │  ├── memory/
│   │  │  │  ├── index.js
│   │  │  │  ├── memory-db.js
│   │  │  ├── index.js
│   │  ├── fragment.js
│   ├── routes/
│   │  ├─ api/
│   │  │  ├─ get.js       # Get a list of current user
│   │  │  ├─ index.js     # Define our routes here
│   │  ├─ index.js        # Access to api folder
│   ├── app.js            # Express app configuration
│   ├── index.js          # Server entry point with .env
│   ├── logger.js         # To log various types of information
│   ├── response.js       # unit-test file
│   ├── server.js         # Server entry point
├── tests/
│   ├── units/
│   │  ├── app.test.js       # unit-test file for app.js
│   │  ├── fragment.test.js       # unit-test file for fragment.js
│   │  ├── get.test.js       # unit-test file for get.js
│   │  ├── health.test.js    # unit-test file for health.js
│   │  ├── memory-db.test.js  # unit-test file for memory-db.js
│   │  ├── memory.test.js  # unit-test file for data/index.js
│   │  ├── response.test.js  # unit-test file for response.js
│   │  ├── .htpasswd         # store test user account 
├── .env                  # Stroe credentails
├── .gitignore            # Ignore unnecessary files for git
├── .prettierignore       # Ignore unnecessary files for prettier
├── .prettierrc
├── env.jest              # Define environment variables
├── eslint.config.mjs     # ESLint configuration
├── jest.config.mjs       # jest configuration
├── package-lock.json     # Package version lock file
├── package.json          # Project metadata and dependencies
└── README.md             # Project documentation
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
> NOTE:`-y` will answer yes to all questions
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
> NOTE:When running `npm install`, it creates a `package-lock.json`
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
git commit -m "Write_what_is_change"
```
#### ESLint
1. Open terminal, setup [ESLint](https://eslint.org/docs/user-guide/getting-started), run `npm audit fix` if you have vulnerabilities
```bash
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
> NOTE: We will have `src/` folder later
4. See which files changed then `add` and `commit` to git.
```sh
git status

git add eslint.config.mjs package-lock.json package.json
git commit -m "Write_what_is_change"
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
> NOTE: `--save` to have dependencies added to `package.json` automatically
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
git commit -m "Write_what_is_change"
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
> NOTE: the -s option [silences](https://everything.curl.dev/usingcurl/verbose#silence) the usual output to CURL, only sending the response from the server to jq
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
git commit -m "Write_what_is_change"
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
git commit -m "Write_what_is_change"
```

## Connect to AWS Services
### AWS Academy Learner Lab instructions
1. Go to [AWS Academy Learner Lab](https://awsacademy.instructure.com/)
2. Click **Start Lab** to start session(each session is 4 hours)
  - yellow dot: the lab is starting
  - green dot : the lab environment is fully started 
  - red dot   : the lab is ened
3. End session to pause AWS resources
> NOTE: DO NOT CLICK `Reset`, it will delete everything
4. Logging account is a `temporary account and session` abd able to access more than 50 AWS services.
5. $50 AWS credits for account, CANNOT be increased if you spend. **DO NOT WASTE THEM**
> NOTE: Monitor spending using the information at the top of the lab, it oftne delayed by up to 8 hours
6. AWS CLI terminal is also available in the lab view. It is automatically configured with your current AWS Security Credentials, and you can use the AWS CLI to manage your AWS services. 
> NOTE: Use `aws help` to see help info (press `space` to scroll, `q` to exit).
### Store AWS Security Credentials
1. In AWS Academy Learner Lab browser tab, click AWS Details and it will show various details including AWS CLI Sow buttton
2. Click show and it reveal yor [AWS Security Credentails](https://docs.aws.amazon.com/general/latest/gr/aws-security-credentials.html), including a profile name, access key, a secret access key, and a session token. Example:
```bash
[default]
aws_access_key_id=AKIAIOSFODNN7EXAMPLE
aws_secret_access_key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
aws_session_token=AQoEXAMPLEH4aoAH0gNCAPy...rkuWJOgQs8IZZaIv2BXIa2R4Olgk
```
> NOTE: the credentials for the default profile are defined
3. Create a `.aws/` folder in your home directory and a file named `credentials`
4. These credentials show be kept secret, **DO NOT SHARE!**
> NOTE: Your Account credentials (e.g., session token) will change each time you start and stop the lab environment.
5. Add `.aws/` to .gitignore
### AWS Management Console
1. In AWS Academy Learner Lab browser tab, click `AWS`. It open the **AWS Management Console** logged into your account
2. Click **Services** button (on the top left).
3. Search `Cognito`, this will be our first service.
### Amazon Cognito
[Amazon Cognito](https://aws.amazon.com/cognito/) allows you to add **authentication**, **authorization**, and **user management** to your web and mobile applications. The service is free for firste 50,000 users each month, let's see more details about [User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/getting-started-user-pools.html).
#### Amazon Cognito User Pool Setup
The **User Pool** helps to manage user registration and sign-in. We can use it to authenticate users directly or integrate with social identity providers like Google, Facebook, and so on. it also support two factor authentication to add an extra layer of security.
> NOTE: Multi-Factor Authentication (MFA)

1. Knowing difference between **authentication** and **authorization**.
  - Authentication: the process of verifying **who** someone is.
  - Authorization : the process of determining **what** someone is allowed to do.
2. Find `Cognito` on the services, and click it.
3. click Create user pool in AWS Console Amazon Cognito page
> NOTE: If you receive `403 Forbidden` errors, you can ignore it. They refer to API calls that your Learner Lab account is not authorized to make in the AWS Console.
4. Create and configure User Pool:
  - Step 1: Configure sign-in experience
    * the default Provider type is correct
    * set sign-in options to **Username** for sign in.
    > NOTE: you can choose **Email** if you want.
  - Step 2: Configure secutiry requirement
    * Password policy options: **Cognito default**
    * Multi-factor authentication: **No MFA**
    * Self-service account recovery: **Enable self-service account recovery**
    * Delivery method for user account recovery messages: **Email Only**
  - Step 3: Configure sign-up experience
    * Self-registration: **Enable self-registration**
    * Clicked: Allow Cognito to automatically send messages to verify and confirm
    * Clicked: Send email message, verify email email address
    * Verifying attribute changes: Keep original attribute value active when an update is pending and to keep the Email address active during an update.
    * Required attributes: `email`
    > NOTE: More info, more responsibility to secure, maintain, bcakup, and manage.
    * Skip: Custom attributes
  - Step 4: Configure message delivery
    * Clicked: Send email with Cognito
    > NOTE: Amazon has [Simple Email Services (SES)](https://aws.amazon.com/ses/), for adding email features to apps. But it adds cost and complexity, here we only testing, so choose **Send email with Cognito**
    * default "no-reply@verificationemail.com" 
    * Keep empty: REPLY-TO email address - optional
  - Step 5: Integrate your app
    * Add user pool name, example: `fragments-swang308`
    * Clicked: Use the Cognito Hosted UI 
    * Domain: Use a Cognito domain. **PREFIX** example: `https://swang308-fragments.auth.us-east-1.amazoncognito.com`, make a note to this URL
    *  App type: Public Client
    > NOTE: A browser-based client cannot contain a secret

    > NOTE: `fragments` web service is NOT going to handle user login or authentication. The `fragments-ui` web app will allow users to authenticate, and only then can they communicate securely with our back-end web service.
    * Choose App client name, example: `fragments-ui`
    * Client secret: Don't generate a client secret
    * Allowed callback URLs: http://localhost:1234
    > NOTE: do NOT have a trailing slash http://localhost:1234 vs. http://localhost:1234/
    * Don't alter: Advanced app client settings or Attribute read and write permissions
    * Tags: Add if you want, this help to identify services and resources for billing purposes.
    > NOTE: [AWS Tags](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html) 
  - Step 6: Review and create
#### Manage User Pool in the Console

1. In Amazon Cognito page, choose your User pool example: `fragments-swang308`
2. See User Pool overview, includes:
  - User pool name
  - User pool ID: for API calls
  - Amazon Resource Name (ARN): a URI that uniquely identifies this AWS resource
3. Below has a list of, horizontally:
  - Users
  - Groups
  - Sign-in experience
  - Sign-up experience
  - Messaging
    * Message templates: Alter the text of the email messages that get sent to users on sign up
  - App integration
    * Domain: Find the Cognito domain for your OAuth endpoint and login page.
    * App client list: Find your fragments-ui app's Client ID. This will look something like `3a6mndd57472vkm1nmcs2od9u3`. 
  - User pool properties

## Create the `fragments-ui` web app and repo
We create a simple web app for testing our microservice. **[Repo](https://github.com/swang308/fragments-ui)**
### Reminder
- `Parcel` uses: http://localhost:1234
### Create Github repo
1. Create a **private** Github repo named `fragments-ui` with a `.gitignore` (for node) and a `README.md`.
2. Clone to your local machine and put `fragments` and `fragments-ui` in same parents folder
```bash
CPP555/
├─ fragments/
├─ fragments-ui/
```
### Set up fragments-ui
1. Use npm to install
```sh
cd fragments-ui
npm init -y
```
2. Edit `package.json` file liek this
```json
{
  "name": "fragments-ui",
  "private": true,
  "version": "0.0.1",
  "description": "Fragments UI testing web app",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/swang308/fragments-ui.git"
  },
  "author": "Shan-Yun, Wang",
  "license": "UNLICENSED"
}
```
### Set up Parcel
1. Use npm to install
```sh
npm install --save-dev parcel
```
2. Create a `src/` folder and `src/index.html`
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>My First Parcel App</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>
```
3. Rubuild app as you change
```sh
npx parcel src/index.html
```
4. Create `src/styles.css` and `src/app.js`
  - src/styles.css
```css
h1 {
  color: hotpink;
  font-family: cursive;
}
```
  - src/app.js
```js
console.log('Hello world!');
```
5. alter `src/index.html`
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>My First Parcel App</title>
    <link rel="stylesheet" href="styles.css" />
    <script type="module" src="app.js"></script>
  </head>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>
```
6. alter `package.json`
```json
{
  "name": "fragments-ui",
  "source": "src/index.html",
  "scripts": {
    "start": "parcel src/index.html",
    "build": "parcel build src/index.html"
  },
  "devDependencies": {
    "parcel": "latest"
  }
}
```
> NOTE: if you are not using `Parcel`, change the port setting. go to **Amazon Cognito** > User Pools > fragments-users > App integration > choose your `fragments-ui` app client at the bottom, then click Edit beside the **Hosted UI** options. Make sure your Allowed callback URLs has correct URL for your local development environment.
### Connect Web App to User Pool: Amazon's aws-amplify
1. To Simplify connecting our web app to our Cognito User Pool and Hosted UI, we'll use Amazon's [aws-amplify](https://www.npmjs.com/package/aws-amplify) **JavaScript SDK**, which includes an auth module.
> NOTE: We are also going to use the latest 5.x.y release vs. the current 6.x.y release, due to some breaking API changes.
2. In `fragments-ui` folder, install aws-amplify
```sh
npm install --save aws-amplify@^5.0.0
```
3. alter `src/index.html`
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Fragments UI</title>
    <link rel="stylesheet" href="https://unpkg.com/bamboo.css" />
    <script type="module" src="src/app.js"></script>
  </head>
  <body>
    <h1>Fragments UI</h1>
    <section>
      <nav><button id="login">Login</button><button id="logout">Logout</button></nav>
    </section>
    <section hidden id="user">
      <h2>Hello <span class="username"></span>!</h2>
    </section>
  </body>
</html>
```
4. Create an `.env` file in `fragments-ui` root folder to define some [environment variables](https://en.wikipedia.org/wiki/Environment_variable).
 - VARIABLE=VALUE (NOTE: no spaces, no quotes)
 - comment: `# This is a comment`
```ini
# .env

# fragments microservice API URL (make sure this is the right port for you)
API_URL=http://localhost:8080

# AWS Amazon Cognito User Pool ID (use your User Pool ID)
AWS_COGNITO_POOL_ID=us-east-1_xxxxxxxxx

# AWS Amazon Cognito Client App ID (use your Client App ID)
AWS_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx

# AWS Amazon Cognito Host UI domain (use your domain only, not the full URL)
AWS_COGNITO_HOSTED_UI_DOMAIN=xxxxxxxx.auth.us-east-1.amazoncognito.com

# OAuth Sign-In Redirect URL (use the port for your fragments-ui web app)
OAUTH_SIGN_IN_REDIRECT_URL=http://localhost:1234

# OAuth Sign-Out Redirect URL (use the port for your fragments-ui web app)
OAUTH_SIGN_OUT_REDIRECT_URL=http://localhost:1234
```
5. Ignore `.env` to github, confirm `.gitignore` includes `.env`
```ini
# Don't include .env, which might have sensitive information
.env
```
6. Create a `src/auth.js`, it will do [OAuth2 Authorization Code Grant](https://developer.okta.com/blog/2018/04/10/oauth-authorization-code-grant-type). Use the process.env global to access our environment variables:
> NOTE: We first need to configure the Auth client with our User Pool details, and provide a way to get the authenticated user's info.
```js
// src/auth.js

import { Amplify, Auth } from 'aws-amplify';

// Configure our Auth object to use our Cognito User Pool
Amplify.configure({
  Auth: {
    // Amazon Region. We can hard-code this (we always use the us-east-1 region)
    region: 'us-east-1',

    // Amazon Cognito User Pool ID
    userPoolId: process.env.AWS_COGNITO_POOL_ID,

    // Amazon Cognito App Client ID (26-char alphanumeric string)
    userPoolWebClientId: process.env.AWS_COGNITO_CLIENT_ID,

    // Hosted UI configuration
    oauth: {
      // Amazon Hosted UI Domain
      domain: process.env.AWS_COGNITO_HOSTED_UI_DOMAIN,

      // These scopes must match what you set in the User Pool for this App Client
      // The default based on what we did above is: email, phone, openid. To see
      // your app's OpenID Connect scopes, go to Amazon Cognito in the AWS Console
      // then: Amazon Cognito > User pools > {your user pool} > App client > {your client}
      // and look in the "Hosted UI" section under "OpenID Connect scopes".
      scope: ['email', 'phone', 'openid'],

      // NOTE: these must match what you have specified in the Hosted UI
      // app settings for Callback and Redirect URLs (e.g., no trailing slash).
      redirectSignIn: process.env.OAUTH_SIGN_IN_REDIRECT_URL,
      redirectSignOut: process.env.OAUTH_SIGN_OUT_REDIRECT_URL,

      // We're using the Access Code Grant flow (i.e., `code`)
      responseType: 'code',
    },
  },
});

/**
 * Get the authenticated user
 * @returns Promise<user>
 */
async function getUser() {
  try {
    // Get the user's info, see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    const currentAuthenticatedUser = await Auth.currentAuthenticatedUser();

    // Get the user's username
    const username = currentAuthenticatedUser.username;

    // If that didn't throw, we have a user object, and the user is authenticated
    console.log('The user is authenticated', username);

    // Get the user's Identity Token, which we'll use later with our
    // microservice. See discussion of various tokens:
    // https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-with-identity-providers.html
    const idToken = currentAuthenticatedUser.signInUserSession.idToken.jwtToken;
    const accessToken = currentAuthenticatedUser.signInUserSession.accessToken.jwtToken;

    // Return a simplified "user" object
    return {
      username,
      idToken,
      accessToken,
      // Include a simple method to generate headers with our Authorization info
      authorizationHeaders: (type = 'application/json') => {
        const headers = { 'Content-Type': type };
        headers['Authorization'] = `Bearer ${idToken}`;
        return headers;
      },
    };
  } catch (err) {
    console.log(err);
    // Unable to get user, return `null` instead
    return null;
  }
}

export { Auth, getUser };
```
7. alter `src/app.js`, it should use `src/auth.js` to handle authentication, get `user` and update UI
```js
// src/app.js

import { Auth, getUser } from './auth';

async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');

  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    Auth.federatedSignIn();
  };
  logoutBtn.onclick = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  };

  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();
  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;
    return;
  }

  // Log the user info for debugging purposes
  console.log({ user });

  // Update the UI to welcome the user
  userSection.hidden = false;

  // Show the user's username
  userSection.querySelector('.username').innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;
}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);
```
### Test Authentication Flows
1. Start your web app locally `npm start` and open browser on http://localhost:1234
2. Click Login, You should be redirected to your Hosted UI domain
3. In the Hosted UI, create a new user by clicking the Sign up link. Enter your desired Username, Name, Email, and Password. Click the Sign up button, and you verify account, by entering a Verification Code from email.
4. Try Logout and Login flow, ensure your UI works as expect
5. After successfully logging in, inspect the `user` object in the Dev Tools console. Ensure the `username` is correct, and that you have an `idToken` and `accessToken` **JSON Web Tokens (JWT)**. One-by-one, copy these JWTs and paste them into the JWT Debugger at [jwt.io](https://jwt.io/). Make sure the tokens are valid and can be decoded, and that the claims you see make sense (i.e., match the user you logged in with).
6. Go back to AWS Console and the Cognito page, find the user you created.
7. We have created our first AWS service. See which files changed then `add` and `commit` to git.
```sh
git status

git add ...
git commit -m "Write_what_is_change"
```

## Secure `fragments` Routes
Add the infrastructure we need to properly authorize users with a Cognito Identity token.
### Setup `fragments`
1. In the root of `fragments`, install the [dotenv](https://www.npmjs.com/package/dotenv). It helps us to read **Environment Variables** from an `.env` file, and load the into our node server's environment at startup:
```sh
npm install --save dotenv
git add package.json package-lock.json
git commit -m "Add dotenv"
```
2. change the default entry point from `src/server.js` to use a new file: `src/index.js`. In `src/index.js`, we load environment variables from an `.env` file.
```js
// src/index.js

// Read environment variables from an .env file (if present)
// NOTE: we only need to do this once, here in our app's main entry point.
require('dotenv').config();

// We want to log any crash cases so we can debug later from logs.
const logger = require('./logger');

// If we're going to crash because of an uncaught exception, log it first.
// https://nodejs.org/api/process.html#event-uncaughtexception
process.on('uncaughtException', (err, origin) => {
  logger.fatal({ err, origin }, 'uncaughtException');
  throw err;
});

// If we're going to crash because of an unhandled promise rejection, log it first.
// https://nodejs.org/api/process.html#event-unhandledrejection
process.on('unhandledRejection', (reason, promise) => {
  logger.fatal({ reason, promise }, 'unhandledRejection');
  throw reason;
});

// Start our server
require('./server');
```
3. Create an `.env` file in the root of your `fragments` repo. Set `PORT` in the file:
```ini
# port to use when starting the server
PORT=8080

# which log messages to show (usually `info` for production, `debug` for development, `silent` to disable)
LOG_LEVEL=debug
```
4. Run server `npm start` and see if it starts on port `8080`. Stop the server, and change port to `9000` in `.env` file. Ensure it works, and change back.

5. Confirm the `.gitignore` includes `.env`
```ini
# Don't include .env, which might have sensitive information
.env
```
6. In `package.json`, modify the startup scripts to `src/index.js`. Confirm `npm start`, `npm run dev`, and `npm run debu`g all continue to work.
7. See which files changed then `add` and `commit` to git.
```sh
git status

git add ...
git commit -m "Write_what_is_change"
```
### Update structure
Add a src/routes/* folder, and associated files, and it should looks like:
```bash
fragments/
├─ package.json
├─ node_modules/
├─ src/
│  ├─ routes/
│  │  ├─ index.js
│  │  ├─ api/
|  │  │  ├─ index.js
|  │  │  ├─ get.js
│  ├─ index.js
│  ├─ server.js
│  ├─ app.js
│  ├─ logger.js
├─ ...
```
1. Do that at the command-line:
```sh
mkdir -p src/routes/api
touch src/routes/index.js
touch src/routes/api/index.js
touch src/routes/api/get.js
```
2. Modify `src/app.js` file to remove the current health check route (and associated code), and move that logic into `src/routes/index.js`:
```js
// modifications to src/app.js

// Remove `app.get('/', (req, res) => {...});` and replace with:

// Define our routes
app.use('/', require('./routes'));
```
3. Update the code in `src/routes/index.js`:
```js
// src/routes/index.js

const express = require('express');

// version and author from package.json
const { version, author } = require('../../package.json');

// Create a router that we can use to mount our API
const router = express.Router();

/**
 * Expose all of our API routes on /v1/* to include an API version.
 */
router.use(`/v1`, require('./api'));

/**
 * Define a simple health check route. If the server is running
 * we'll respond with a 200 OK.  If not, the server isn't healthy.
 */
router.get('/', (req, res) => {
  // Client's shouldn't cache this response (always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');
  // Send a 200 'OK' response
  res.status(200).json({
    status: 'ok',
    author,
    // Use your own GitHub URL for this!
    githubUrl: 'https://github.com/REPLACE_WITH_YOUR_GITHUB_USERNAME/fragments',
    version,
  });
});

module.exports = router;
```
4. Start to define the fragments API endpoints in `src/routes/api/index.js`
```js
// src/routes/api/index.js

/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');

// Create a router on which to mount our API endpoints
const router = express.Router();

// Define our first route, which will be: GET /v1/fragments
router.get('/fragments', require('./get'));
// Other routes (POST, DELETE, etc.) will go here later on...

module.exports = router;
```
5. Start an initial implementation of the GET /v1/fragments route in `src/routes/api/get.js`:
```js
// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */
module.exports = (req, res) => {
  // TODO: this is just a placeholder. To get something working, return an empty array...
  res.status(200).json({
    status: 'ok',
    // TODO: change me
    fragments: [],
  });
};
```
6. Test and Run to see everything still works, ensure the `curl localhost:8080` and `curl localhost:8080/v1/fragments` also give you response you expect.
7. See which files changed then `add` and `commit` to git.
```sh
git status

git add ...
git commit -m "Write_what_is_change"
```
### Add JWT token with Passport.js
Add necessary dependencies to use a JWT token to secure our Express routes with [Passport.js](https://www.passportjs.org/)(Including [passport](https://www.npmjs.com/package/passport), [passport-http-bearer](https://www.npmjs.com/package/passport-http-bearer), and [aws-jwt-verify](https://www.npmjs.com/package/aws-jwt-verify)). Our microservice will use Passport.js to parse the `Authorization` header of all incoming requests and look for a `Bearer` token. We'll then verify this token with the AWS JWT Verifier module, and make sure that we can trust the user's identity.
> NOTE: The aws-jwt-verify module previously needed to be set to 2.1.3 vs. 3.x due to a [bug](https://github.com/awslabs/aws-jwt-verify/issues/66) in how it [interacts with Jest](https://github.com/facebook/jest/issues/12270). This should be fixed, but be aware that you can use aws-jwt-verify@2.1.3 instead of aws-jwt-verify below if you have issues.
1. Install passport, passport-http-bearer, and aws-jwt-verify
```sh
npm install --save passport passport-http-bearer aws-jwt-verify
```
2. Add configuration information to `.env`, it helps **AWS JWT Verifier** knows about your Cognito User Pool (NOTE: use the values you wrote down above for the Amazon Cognito IDs):
```ini
# Port for the server
PORT=8080

# which log messages to show (usually `info` for production, `debug` for development, `silent` to disable)
LOG_LEVEL=debug

# AWS Amazon Cognito User Pool ID (use your User Pool ID)
AWS_COGNITO_POOL_ID=us-east-1_xxxxxxxxx

# AWS Amazon Cognito Client App ID (use your Client App ID)
AWS_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```
3. Create a `src/auth.js` file to define our Passport strategy and authentication functions:
```js
// src/auth.js

// Configure a JWT token strategy for Passport based on
// Identity Token provided by Cognito. The token will be
// parsed from the Authorization header (i.e., Bearer Token).

const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const { CognitoJwtVerifier } = require('aws-jwt-verify');

const logger = require('./logger');

// Create a Cognito JWT Verifier, which will confirm that any JWT we
// get from a user is valid and something we can trust. See:
// https://github.com/awslabs/aws-jwt-verify#cognitojwtverifier-verify-parameters
const jwtVerifier = CognitoJwtVerifier.create({
  // These variables must be set in the .env
  userPoolId: process.env.AWS_COGNITO_POOL_ID,
  clientId: process.env.AWS_COGNITO_CLIENT_ID,
  // We expect an Identity Token (vs. Access Token)
  tokenUse: 'id',
});

// Later we'll use other auth configurations, so it's important to log what's happening
logger.info('Configured to use AWS Cognito for Authorization');

// At startup, download and cache the public keys (JWKS) we need in order to
// verify our Cognito JWTs, see https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-key-sets
// You can try this yourself using:
// curl https://cognito-idp.us-east-1.amazonaws.com/<user-pool-id>/.well-known/jwks.json
jwtVerifier
  .hydrate()
  .then(() => {
    logger.info('Cognito JWKS successfully cached');
  })
  .catch((err) => {
    logger.error({ err }, 'Unable to cache Cognito JWKS');
  });

module.exports.strategy = () =>
  // For our Passport authentication strategy, we'll look for the Bearer Token
  // in the Authorization header, then verify that with our Cognito JWT Verifier.
  new BearerStrategy(async (token, done) => {
    try {
      // Verify this JWT
      const user = await jwtVerifier.verify(token);
      logger.debug({ user }, 'verified user token');

      // Create a user, but only bother with their email. We could
      // also do a lookup in a database, but we don't need it.
      done(null, user.email);
    } catch (err) {
      logger.error({ err, token }, 'could not verify token');
      done(null, false);
    }
  });

module.exports.authenticate = () => passport.authenticate('bearer', { session: false });
```
4. Run the server `npm run dev` to check the `Cognito JWKS cached` message gets logged, should be like:
```bash
[22:04:08.850] INFO (9424): Configured to use AWS Cognito for Authorization
[22:04:08.879] INFO (9424): Server started on port 8080
[22:04:08.985] INFO (9424): Cognito JWKS successfully cached
```
5. Update `src/routes/index.js` to use our authenticate middleware for all of the /v1/* routes:
```js
// modifications to src/routes/index.js
...
// Our authentication middleware
const { authenticate } = require('../auth');
...
/**
 * Expose all of our API routes on /v1/* to include an API version.
 * Protect them all with middleware so you have to be authenticated
 * in order to access things.
 */
router.use(`/v1`, authenticate(), require('./api'));
...
```
6. Run server and ensure
  - `curl -i localhost:8080` returns a 200
  - `curl -i localhost:8080/v1/fragments` returns a 401 Unauthorized. 
7. If they don't work how you expect, debug and fix things until they do.
8. See which files changed then `add` and `commit` to git.
```sh
git status

git add ...
git commit -m "Write_what_is_change"
```

## Connect Client Web App to Secure Microservice
Our goal is to have a user sign-in via our web app, then use the token we get back from AWS to do a secure GET request to our microservice. If all goes we'll we'll get back a 200 with some data that we can log to the browser console.
### `fragments-ui` Web App
1. In `fragments-ui` web app repo, add a new file `src/api.js`. We define a function to get a user's fragments from the fragments microservice:
```js
// src/api.js

// fragments microservice API to use, defaults to localhost:8080 if not set in env
const apiUrl = process.env.API_URL || 'http://localhost:8080';

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
  console.log('Requesting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      // Generate headers with the proper Authorization bearer token to pass.
      // We are using the `authorizationHeaders()` helper method we defined
      // earlier, to automatically attach the user's ID token.
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Successfully got user fragments data', { data });
    return data;
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}
```
2. In `src/app.js` call `getUserFragments()` function when a user is authenticated on page load:
```js
// modifications to src/app.js
...
import { getUserFragments } from './api';
...
async function init() {
  ...
  const user = await getUser();
  ...
  // Do an authenticated request to the fragments API server and log the result
  const userFragments = await getUserFragments(user);

  // TODO: later in the course, we will show all the user's fragments in the HTML...
}
```
3. Open two terminals
  - First one to run your web app client
    * Start `fragments` server on port 8080 using npm run dev.
  - Second one to run your microservice at the same time.
    * Start `fragments-ui` web app client on port `1234`. Browse to your `fragments-ui` **front-end web app** and open your browser's Dev Tools so that you can see the Console.
4. Click the **Login** button and sign-in with Cognito. When you are redirected back to your web app, make sure the console shows a successful result for the authenticated GET /v1/fragment request.
5. Take a look at the logs that your `fragments` server produced. Ensure you see the successful request and response, and that the token is being sent in the Authorization header.
6. If they don't work how you expect, debug and fix things until they do.
7. See which files changed then `add` and `commit` to git.
```sh
git status

git add ...
git commit -m "Write_what_is_change"
```

## GitHub Actions Continuous Integration
### Build YAML file
1. Create `.github/workflows` in repo
2. Create a workflow `YAML` file for our Continuous Integration (CI) job:
 `.github/workflows/ci.yml`
3. Example of `.github/workflows/ci.yml`
```yml
# .github/workflows/ci.yml

# Continuous Integration (CI) Workflow
name: ci

# This workflow will run whenever we push commits to the `main` branch, or
# whenever there's a pull request to the `main` branch. See:
# https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#on
on:
  pull_request:
    branches:
      - main
  push:
    branches:
      - main

jobs:
  lint:
    # Give your job a name that will show up in the GitHub Actions web UI
    name: ESLint
    # We'll run this on a Linux (Ubuntu) VM, since we'll deploy on Linux too.
    runs-on: ubuntu-latest
    # We run these steps one after the other, and if any fail, we stop the process
    steps:
      # https://github.com/actions/checkout
      - name: Check out code
        uses: actions/checkout@v4

      # https://github.com/actions/setup-node
      - name: Setup node
        uses: actions/setup-node@v4
        with:
          # Use node LTS https://github.com/actions/setup-node#supported-version-syntax
          node-version: 'lts/*'
          # Cache npm dependencies so they don't have to be downloaded next time - https://github.com/actions/setup-node#caching-packages-dependencies
          cache: 'npm'

      - name: Install node dependencies
        # Use `ci` vs. `install`, see https://docs.npmjs.com/cli/v8/commands/npm-ci
        run: npm ci

      - name: Run ESLint
        run: npm run lint
```
4. See which files changed then `add` and `commit` to git.
```sh
git status

git add ...
git commit -m "Write_what_is_change"
```
5. Open `fragments` github repo and click **Actions**
6. Click **ESLint** to see all the steps
7. Your latest commit should have a green checkmark next to it, if it has a **red X**, fix it.

## Unit Test
### Install Jest
1. Install Jest
```bash
npm install --save-dev jest
```
2. Create an **environment file** in the root of the project for use in our tests: `env.jest`
```ini
# env.jest

################################################################################
# Environment variables with values for running the tests. This file can be
# committed to git, since it's only used for testing, and won't contain secrets.
################################################################################

# HTTP Port (defaults to 8080)
PORT=8080

# Disable logs in tests. If you need to see more detail, change this to `debug`
LOG_LEVEL=silent
```
3. Create a [config file for Jest](https://jestjs.io/docs/configuration), it will load our `env.jest` test enviornment variables and set various options
```js
// jest.config.js

// Get the full path to our env.jest file
const path = require('path');
const envFile = path.join(__dirname, 'env.jest');

// Read the environment variables we use for Jest from our env.jest file
require('dotenv').config({ path: envFile });

// Log a message to remind developers how to see more detail from log messages
console.log(`Using LOG_LEVEL=${process.env.LOG_LEVEL}. Use 'debug' in env.jest for more detail`);

// Set our Jest options, see https://jestjs.io/docs/configuration
module.exports = {
  verbose: true,
  testTimeout: 5000,
};
```
4. Update eslint.config.mjs configuration file so that ESLint knows that we're using Jest
```mjs
// eslint.config.mjs

import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  pluginJs.configs.recommended,
];
```
5. Update `package.json` to run unit-test
- `test` - run all tests using `jest.config.js` configuration [one-by-one](https://jestjs.io/docs/cli#--runinband) vs. in parallel (it's easier to test serially than in parallel). The final -- means that we'll pass any arguments we receive via the npm invocation to Jest, allowing us to run a single test or set of tests. More on this below.
- `test:watch` - same idea as test, but don't quit when the tests are finished. Instead, watch the files for changes and re-run tests when we update our code (e.g., save a file). This is helpful when you're editing code and want to run tests in a loop as you edit and save the code.
- `coverage` - same idea as `test` but collect test coverage information
```ini
  "scripts": {
    "test:watch": "jest -c jest.config.js --runInBand --watch --",
    "test": "jest -c jest.config.js --runInBand --",
    "coverage": "jest -c jest.config.js --runInBand --coverage",
    "lint": "eslint \"./src/**/*.js\"",
    "start": "node src/index.js",
    "dev": "LOG_LEVEL=debug nodemon ./src/index.js --watch src",
    "debug": "LOG_LEVEL=debug nodemon --inspect=0.0.0.0:9229 ./src/index.js --watch src"
  }
```
6. Run the `test`
```bash
$ npm test

> fragments@0.0.1 test
> jest -c jest.config.js --runInBand --

Using LOG_LEVEL=silent. Use 'debug' in env.jest for more detail
No tests found, exiting with code 1
Run with `--passWithNoTests` to exit with code 0
In /Users/humphd/CCP555/fragments
  14 files checked.
  testMatch: **/__tests__/**/*.[jt]s?(x), **/?(*.)+(spec|test).[tj]s?(x) - 0 matches
  testPathIgnorePatterns: /node_modules/ - 14 matches
  testRegex:  - 0 matches
Pattern:  - 0 matches
```
### Testing file `src/response.js`
1. Add a new module to `src/response.js`, and export two functions: `createSuccessResponse()` and `createErrorResponse()`:
```js
// src/response.js

/**
 * A successful response looks like:
 *
 * {
 *   "status": "ok",
 *   ...
 * }
 */
module.exports.createSuccessResponse = function (data) {
  return {
    status: 'ok',
    // TODO ...
  };
};

/**
 * An error response looks like:
 *
 * {
 *   "status": "error",
 *   "error": {
 *     "code": 400,
 *     "message": "invalid request, missing ...",
 *   }
 * }
 */
module.exports.createErrorResponse = function (code, message) {
  // TODO ...
};
```
2. Create folder `tests/unit`
3. Add a new unit test file, `tests/unit/response.test.js`
> NOTE: with Jest, the file is named the same as the file it tests, but adds `.test.`; so `response.test.j`s is a test for response.js.
```js
// tests/unit/response.test.js

const { createErrorResponse, createSuccessResponse } = require('../../src/response');

// Define (i.e., name) the set of tests we're about to do
describe('API Responses', () => {
  // Write a test for calling createErrorResponse()
  test('createErrorResponse()', () => {
    const errorResponse = createErrorResponse(404, 'not found');
    // Expect the result to look like the following
    expect(errorResponse).toEqual({
      status: 'error',
      error: {
        code: 404,
        message: 'not found',
      },
    });
  });

  // Write a test for calling createSuccessResponse() with no argument
  test('createSuccessResponse()', () => {
    // No arg passed
    const successResponse = createSuccessResponse();
    // Expect the result to look like the following
    expect(successResponse).toEqual({
      status: 'ok',
    });
  });

  // Write a test for calling createSuccessResponse() with an argument
  test('createSuccessResponse(data)', () => {
    // Data argument included
    const data = { a: 1, b: 2 };
    const successResponse = createSuccessResponse(data);
    // Expect the result to look like the following
    expect(successResponse).toEqual({
      status: 'ok',
      a: 1,
      b: 2,
    });
  });
});
```
> NOTE: We are using Jest's [`expect()` matchers](https://jestjs.io/docs/expect). These functions provide easy ways to test for various conditions in our test cases. Take a minute to look through the list of all the possible [methods](https://jestjs.io/docs/expect#methods) you can call with `expect()`.
4. Update your lint script in `package.json`, including this new `tests/ directory` along with `src/` when running ESLint:
```json
"lint": "eslint \"./src/**/*.js\" \"tests/**/*.js\"",
```
5. Run test, with 3 tests running. The `createSuccessResponse()` test should pass, and the `createErrorResponse()` and `createSuccessResponse(data)` tests should **fail**.
```bash
npm test
```
6. Run our tests in `watch` mode
```bash
npm run test:watch
```
7. Modify `src/response.js`
```js
module.exports.createSuccessResponse = function (data) {
  return {
    status: 'ok',
    // Use the spread operator to clone `data` into our object, see:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals
    ...data,
  };
};
```
8. Save and test again, you should see 3 of your tests to pass



####
### HTTP Unit Tests with Supertest
With [supertest](https://www.npmjs.com/package/supertest), we can create HTTP requests to our Express routes, and write assertions about what we expect to get back (e.g., which HTTP response code and what should be in the response body).
> NOTE: A common package we use for writing these tests in node is supertest, which is an HTTP assertion module built on top of [superagent](https://github.com/visionmedia/superagent), an HTTP request library.

1. Install `supertest` module as a development dependency
```bash
npm install --save-dev supertest
```
2. Create a new unit test file to test your health check route: `tests/unit/health.test.js`
```js
// tests/unit/health.test.js

const request = require('supertest');

// Get our Express app object (we don't need the server part)
const app = require('../../src/app');

// Get the version and author from our package.json
const { version, author } = require('../../package.json');

describe('/ health check', () => {
  test('should return HTTP 200 response', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });

  test('should return Cache-Control: no-cache header', async () => {
    const res = await request(app).get('/');
    expect(res.headers['cache-control']).toEqual('no-cache');
  });

  test('should return status: ok in response', async () => {
    const res = await request(app).get('/');
    expect(res.body.status).toEqual('ok');
  });

  test('should return correct version, githubUrl, and author in response', async () => {
    const res = await request(app).get('/');
    expect(res.body.author).toEqual(author);
    expect(res.body.githubUrl.startsWith('https://github.com/')).toBe(true);
    expect(res.body.version).toEqual(version);
  });
});
```
3. Run test, and see why test fail?
```bash
$ npm test

> fragments@0.0.1 test
> jest -c jest.config.js --runInBand --

Using LOG_LEVEL=silent. Use 'debug' in env.jest for more detail
 PASS  tests/unit/response.test.js
  API Responses
    ✓ createErrorResponse() (1 ms)
    ✓ createSuccessResponse()
    ✓ createSuccessResponse(data)

 FAIL  tests/unit/health.test.js
  ● Test suite failed to run

    TypeError: Cannot read properties of undefined (reading 'match')

      12 | // get from a user is valid and something we can trust. See:
      13 | // https://github.com/awslabs/aws-jwt-verify#cognitojwtverifier-verify-parameters
    > 14 | const jwtVerifier = CognitoJwtVerifier.create({
         |                                        ^
      15 |   userPoolId: process.env.AWS_COGNITO_POOL_ID,
      16 |   clientId: process.env.AWS_COGNITO_CLIENT_ID,
      17 |   // We expect an Identity Token (vs. Access Token)

      at Function.parseUserPoolId (node_modules/aws-jwt-verify/dist/cjs/cognito-verifier.js:73:34)
      at new CognitoJwtVerifier (node_modules/aws-jwt-verify/dist/cjs/cognito-verifier.js:59:39)
      at Function.create (node_modules/aws-jwt-verify/dist/cjs/cognito-verifier.js:86:16)
      at Object.<anonymous> (src/auth.js:14:40)
      at Object.<anonymous> (src/app.js:14:23)

Test Suites: 1 failed, 1 passed, 2 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        0.439 s, estimated 1 s
Ran all test suites.
```
Our tests are failing because the environment variables needed for authentication (`AWS_COGNITO_POOL_ID` and `AWS_COGNITO_CLIENT_ID`) are missing. The test environment doesn't load these variables, leading to a crash when the app tries to use them. Specifically, it fails when calling the `.match()` method on an undefined value.
### Create Better Error Messages
Our `src/auth.js` code relies on `AWS_COGNITO_POOL_ID` and `AWS_COGNITO_CLIENT_ID` being defined in the environment. If they're missing, the program will behave unpredictably and may crash with an unhelpful error message, making it hard to trace the issue.

1. Modify `src/auth.js`, with a message indicating that these environment variables are missing
```js
// modification to src/auth.js

// Configure a JWT token strategy for Passport based on
// Identity Token provided by Cognito. The token will be
// parsed from the Authorization header (i.e., Bearer Token).

const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const { CognitoJwtVerifier } = require('aws-jwt-verify');

const logger = require('./logger');

// We expect AWS_COGNITO_POOL_ID and AWS_COGNITO_CLIENT_ID to be defined.
if (!(process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID)) {
  throw new Error('missing expected env vars: AWS_COGNITO_POOL_ID, AWS_COGNITO_CLIENT_ID');
}
...
```
2. In your `.env` file, try commenting out one of the AWS_COGNITO_* variables
3. Run server, `npm start`
```bash
$ npm start

> fragments@0.0.1 start
> node src/index.js

{"level":60,"time":1642790744289,"pid":28264,"hostname":"emone.localdomain","err":{"type":"Error","message":"missing env vars: no authorization configuration found","stack":"Error: missing env vars: no authorization configuration found\n    at Object.<anonymous> (/Users/humphd/Seneca/CCP555/fragments/src/auth/index.js:11:9)\n    at Module._compile (node:internal/modules/cjs/loader:1101:14)\n    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1153:10)\n    at Module.load (node:internal/modules/cjs/loader:981:32)\n    at Function.Module._load (node:internal/modules/cjs/loader:822:12)\n    at Module.require (node:internal/modules/cjs/loader:1005:19)\n    at require (node:internal/modules/cjs/helpers:102:18)\n    at Object.<anonymous> (/Users/humphd/Seneca/CCP555/fragments/src/app.js:14:23)\n    at Module._compile (node:internal/modules/cjs/loader:1101:14)\n    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1153:10)"},"origin":"uncaughtException","msg":"uncaughtException"}
/Users/humphd/Seneca/CCP555/fragments/src/index.js:11
  throw err;
  ^

Error: missing env vars: no authorization configuration found
    at Object.<anonymous> (/Users/humphd/Seneca/CCP555/fragments/src/auth/index.js:11:9)
    at Module._compile (node:internal/modules/cjs/loader:1101:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1153:10)
    at Module.load (node:internal/modules/cjs/loader:981:32)
    at Function.Module._load (node:internal/modules/cjs/loader:822:12)
    at Module.require (node:internal/modules/cjs/loader:1005:19)
    at require (node:internal/modules/cjs/helpers:102:18)
    at Object.<anonymous> (/Users/humphd/Seneca/CCP555/fragments/src/app.js:14:23)
    at Module._compile (node:internal/modules/cjs/loader:1101:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1153:10)
```
4. Fix your `.env` file to uncomment your `AWS_COGNITO_*` variables, and ensure your server starts.
5. Run the tests
```bash
$ npm test

> fragments@0.0.1 test
> jest -c jest.config.js --runInBand --

Using LOG_LEVEL=silent. Use 'debug' in env.jest for more detail
 PASS  tests/unit/response.test.js
  API Responses
    ✓ createErrorResponse() (1 ms)
    ✓ createSuccessResponse()
    ✓ createSuccessResponse(data)

 FAIL  tests/unit/health.test.js
  ● Test suite failed to run

    missing expected env vars: AWS_COGNITO_POOL_ID, AWS_COGNITO_CLIENT_ID

      11 | // We expect AWS_COGNITO_POOL_ID and AWS_COGNITO_CLIENT_ID to be defined.
      12 | if (!(process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID)) {
    > 13 |   throw new Error('missing expected env vars: AWS_COGNITO_POOL_ID, AWS_COGNITO_CLIENT_ID');
         |         ^
      14 | }
      15 |
      16 | // Create a Cognito JWT Verifier, which will confirm that any JWT we

      at Object.<anonymous> (src/auth.js:13:9)
      at Object.<anonymous> (src/app.js:14:23)

Test Suites: 1 failed, 1 passed, 2 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        0.425 s, estimated 1 s
Ran all test suites.
```
Proactively handling missing data makes debugging easier and ensures maintainability. Crashing with clear error messages for missing environment variables like `AWS_COGNITO_POOL_ID` helps prevent unpredictable behavior. Cloud-ready software needs to handle both ideal and failure scenarios, and informative crashes lead to quicker fixes.
### Simplifying Authentication in Testing and Development
While we've improved error clarity, we still can't run tests without authenticating against Cognito, and automating OAuth2 authentication is complex. Instead, we'll simplify by adding a second `Passport.js` strategy for testing: [HTTP Basic Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication). This method allows us to [authenticate](https://en.wikipedia.org/wiki/Basic_access_authentication#Client_side) users in tests without relying on Cognito’s complex flow.

We'll create test user accounts using an [`.htpasswd`](https://httpd.apache.org/docs/2.4/programs/htpasswd.html) file, which will only be used during testing. This lets us hard-code user credentials and bypass Cognito, focusing on the functionality of our code. Tools like the `htpasswd` node module, runnable via [`npx`](https://nodejs.dev/learn/the-npx-nodejs-package-runner), can help create the file easily across platforms.

1. Add two users to a new file, `tests/.htpasswd`
```bash
npx htpasswd -cbB tests/.htpasswd user1@email.com password1
npx htpasswd -bB tests/.htpasswd user2@email.com password2
```
2. You will have a `tests/.htpasswd` file, and it will look something like this
```ini
user1@email.com:$2y$05$GDRI8grIF2scr39MIUo6leaOud5xnMSC0BXuZDc2.Bdlccug./tU6
user2@email.com:$2y$05$ycsS/OI8GrRMmBPnEWu1huQDIROvndt2m49b2JxzPoeBgNEyujeFq
```
> NOTE: the passwords you entered above encrypted using [bcrypt](https://en.wikipedia.org/wiki/Bcrypt)
3. Install two new node modules for working with Basic Authentication in Passport.js, `http-auth` and `http-auth-passport`:
```bash
npm install --save http-auth http-auth-passport
```
4. [Refactor](https://en.wikipedia.org/wiki/Code_refactoring) `src/auth.js` file so that it works for both Cognito JWTs as well as HTTP Basic Authentication.
```bash
src/
├─ auth.js
├─ auth/
│  ├─ cognito.js
│  ├─ basic-auth.js
│  ├─ index.js
...
```
> NOTE: We separate our Cognito and Basic Authentication strategies into two different files: `cognito.js` and `basic-auth.js`, `src/auth/index.js` will be used to figure out which of the two strategies to use at runtime, based on our environment variables.
5. Copy and paste all of the code in `src/auth.js` into `src/auth/cognito.js`
```js
// src/auth/cognito.js

// Configure a JWT token strategy for Passport based on
// Identity Token provided by Cognito. The token will be
// parsed from the Authorization header (i.e., Bearer Token).

const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const { CognitoJwtVerifier } = require('aws-jwt-verify');

const logger = require('../logger');

// We expect AWS_COGNITO_POOL_ID and AWS_COGNITO_CLIENT_ID to be defined.
if (!(process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID)) {
  throw new Error('missing expected env vars: AWS_COGNITO_POOL_ID, AWS_COGNITO_CLIENT_ID');
}

// Create a Cognito JWT Verifier, which will confirm that any JWT we
// get from a user is valid and something we can trust. See:
// https://github.com/awslabs/aws-jwt-verify#cognitojwtverifier-verify-parameters
const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: process.env.AWS_COGNITO_POOL_ID,
  clientId: process.env.AWS_COGNITO_CLIENT_ID,
  // We expect an Identity Token (vs. Access Token)
  tokenUse: 'id',
});

// At startup, download and cache the public keys (JWKS) we need in order to
// verify our Cognito JWTs, see https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-key-sets
// You can try this yourself using:
// curl https://cognito-idp.us-east-1.amazonaws.com/<user-pool-id>/.well-known/jwks.json
jwtVerifier
  .hydrate()
  .then(() => {
    logger.info('Cognito JWKS cached');
  })
  .catch((err) => {
    logger.error({ err }, 'Unable to cache Cognito JWKS');
  });

module.exports.strategy = () =>
  // For our Passport authentication strategy, we'll look for the Bearer Token
  // in the Authorization header, then verify that with our Cognito JWT Verifier.
  new BearerStrategy(async (token, done) => {
    try {
      // Verify this JWT
      const user = await jwtVerifier.verify(token);
      logger.debug({ user }, 'verified user token');

      // Create a user, but only bother with their email
      done(null, user.email);
    } catch (err) {
      logger.error({ err, token }, 'could not verify token');
      done(null, false);
    }
  });

module.exports.authenticate = () => passport.authenticate('bearer', { session: false });
```
6. Write `src/auth/index.js`
```bash
// src/auth/index.js

// Prefer Amazon Cognito
if (process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID) {
  module.exports = require('./cognito');
}
// Also allow for an .htpasswd file to be used, but not in production
else if (process.env.HTPASSWD_FILE && process.NODE_ENV !== 'production') {
  module.exports = require('./basic-auth');
}
// In all other cases, we need to stop now and fix our config
else {
  throw new Error('missing env vars: no authorization configuration found');
}
```
7. Delete `src/auth.js`
```bash
$ git rm src/auth.js -f
rm 'src/auth.js'
```
8. Run test
```bash
$ npm test

> fragments@0.0.1 test
> jest -c jest.config.js --runInBand --

Using LOG_LEVEL=silent. Use 'debug' in env.jest for more detail
 PASS  tests/unit/response.test.js
  API Responses
    ✓ createErrorResponse() (1 ms)
    ✓ createSuccessResponse()
    ✓ createSuccessResponse(data)

 FAIL  tests/unit/health.test.js
  ● Test suite failed to run

    missing env vars: no authorization configuration found

       9 | // In all other cases, we need to stop now and fix our config
      10 | else {
    > 11 |   throw new Error('missing env vars: no authorization configuration found');
         |         ^
      12 | }
      13 |

      at Object.<anonymous> (src/auth/index.js:11:9)
      at Object.<anonymous> (src/app.js:14:23)

Test Suites: 1 failed, 1 passed, 2 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        0.405 s, estimated 1 s
Ran all test suites.
```
9. Run server and ensure the existing Cognito strategy is still working
```bash
$ npm run dev

> fragments@0.0.1 dev
> LOG_LEVEL=debug nodemon ./src/index.js --watch src

[nodemon] 2.0.15
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src/**/*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node ./src/index.js`
[1642717658142] INFO (16503 on localdomain): Server started
    port: 8080
[1642717658295] INFO (16503 on localdomain): Cognito JWKS cached
```
### Configure Unit Tests to Use Basic Auth
1. Add the `HTPASSWD_FILE` variable to your `env.jest` environment file
```jest
# env.jest

# HTTP Port (defaults to 8080)
PORT=8080

# Disable logs in tests. If you need to see more detail, change this to `debug`
LOG_LEVEL=silent

# .htpasswd file to use in testing
HTPASSWD_FILE=tests/.htpasswd
```
2. Run test
```bash
$ npm test

> fragments@0.0.1 test
> jest -c jest.config.js --runInBand --

Using LOG_LEVEL=silent. Use 'debug' in env.jest for more detail
 PASS  tests/unit/response.test.js
  API Responses
    ✓ createErrorResponse() (1 ms)
    ✓ createSuccessResponse()
    ✓ createSuccessResponse(data)

 PASS  tests/unit/health.test.js
  / health check
    ✓ should return HTTP 200 response (12 ms)
    ✓ should return Cache-Control: no-cache header (2 ms)
    ✓ should return status: ok in response (1 ms)
    ✓ should return correct version, githubUrl, and author in response (1 ms)

Test Suites: 2 passed, 2 total
Tests:       7 passed, 7 total
Snapshots:   0 total
Time:        0.369 s, estimated 1 s
Ran all test suites.
```
### Use Basic Auth in Unit Tests
1. Update `src/routes/index.js`, We should be able to write two new test cases in order to test this code: 1) an **authenticated** request; 2) an **unauthenticated** request. In both cases, the HTTP responses should match what we expect.


```js
// src/routes/index.js

/**
 * Expose all of our API routes on /v1/* to include an API version.
 * Protect them all so you have to be authenticated in order to access.
 */
router.use(`/v1`, authenticate(), require('./api'));

////////////////////////////////////////////////////////////////////

// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */
module.exports = (req, res) => {
  // TODO: this is just a placeholder to get something working
  res.status(200).json({
    status: 'ok',
    fragments: [],
  });
};
```
2. Add a new unit test file, `tests/unit/get.test.js`
```js
// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  // TODO: we'll need to add tests to check the contents of the fragments array later
});
```
3. Run test
```bash
$ npm test

> fragments@0.0.1 test
> jest -c jest.config.js --runInBand --

Using LOG_LEVEL=silent. Use 'debug' in env.jest for more detail
 PASS  tests/unit/health.test.js
  / health check
    ✓ should return HTTP 200 response (8 ms)
    ✓ should return Cache-Control: no-cache header (2 ms)
    ✓ should return status: ok in response (3 ms)
    ✓ should return correct version, githubUrl, and author in response (1 ms)

 PASS  tests/unit/get.test.js
  GET /v1/fragments
    ✓ unauthenticated requests are denied (8 ms)
    ✓ incorrect credentials are denied (2 ms)
    ✓ authenticated users get a fragments array (12 ms)

 PASS  tests/unit/response.test.js
  API Responses
    ✓ createErrorResponse() (1 ms)
    ✓ createSuccessResponse()
    ✓ createSuccessResponse(data)

Test Suites: 3 passed, 3 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        0.472 s, estimated 1 s
Ran all test suites.
```
4. Run a single test file by passing all
```bash
$ npm test get.test.js

> fragments@0.0.1 test
> jest -c jest.config.js --runInBand -- "get.test.js"

Using LOG_LEVEL=silent. Use 'debug' in env.jest for more detail
 PASS  tests/unit/get.test.js
  GET /v1/fragments
    ✓ unauthenticated requests are denied (11 ms)
    ✓ incorrect credentials are denied (2 ms)
    ✓ authenticated users get a fragments array (12 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        0.316 s, estimated 1 s
Ran all test suites matching /get.test.js/i.
```
### Examining Test Coverage
1. When we added Jest earlier, we created a number of npm scripts to run it. One of those was the coverage script
```bash
$ npm run coverage

> fragments@0.0.1 coverage
> jest -c jest.config.js --runInBand --coverage

Using LOG_LEVEL=silent. Use 'debug' in env.jest for more detail
 PASS  tests/unit/get.test.js
  GET /v1/fragments
    ✓ unauthenticated requests are denied (10 ms)
    ✓ incorrect credentials are denied (2 ms)
    ✓ authenticated users get a fragments array (12 ms)

 PASS  tests/unit/health.test.js
  / health check
    ✓ should return HTTP 200 response (5 ms)
    ✓ should return Cache-Control: no-cache header (2 ms)
    ✓ should return status: ok in response (2 ms)
    ✓ should return correct version, githubUrl, and author in response (2 ms)

 PASS  tests/unit/response.test.js
  API Responses
    ✓ createErrorResponse() (1 ms)
    ✓ createSuccessResponse()
    ✓ createSuccessResponse(data)

-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------|---------|----------|---------|---------|-------------------
All files          |   83.87 |       40 |      75 |    83.6 |
 src               |   78.78 |       20 |      50 |   78.78 |
  app.js           |      76 |        0 |       0 |      76 | 41,55-63
  logger.js        |      75 |       50 |     100 |      75 | 7
  response.js      |     100 |      100 |     100 |     100 |
 src/auth |   78.57 |       60 |     100 |   76.92 |
  basic-auth.js    |   88.88 |       50 |     100 |    87.5 | 10
  index.js         |      60 |     62.5 |     100 |      60 | 3,11
 src/routes        |     100 |      100 |     100 |     100 |
  index.js         |     100 |      100 |     100 |     100 |
 src/routes/api    |     100 |      100 |     100 |     100 |
  get.js           |     100 |      100 |     100 |     100 |
  index.js         |     100 |      100 |     100 |     100 |
-------------------|---------|----------|---------|---------|-------------------
Test Suites: 3 passed, 3 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        0.62 s, estimated 1 s
Ran all test suites.
```
Running our tests also collected coverage data, showing which files and lines were executed. The report highlights the percentage of statements, branches, functions, and lines covered by tests, along with specific lines that lack coverage (e.g., lines 3 and 11 in `src/auth/index.js`). A detailed web report can be viewed by opening `coverage/lcov-report/index.html`.

Coverage data helps identify untested parts of the project, such as missing branches in conditional statements. However, 100% coverage isn't always practical, as some code (like our Cognito authentication) may not be testable. Aim for 80-100% coverage, focusing on meaningful test coverage rather than perfection.
### Improving Test Coverage by Adding More Tests
1. Modify `tests/unit/app.test.js`
```js
test('should return HTTP 404 response', async () => {
  const res = await request(app).get('/404');
  expect(res.statusCode).toBe(404);
});
```
2. Run coverage, you should see `app.js` line **41** has gone
### Running Unit Tests in CI
1. Add another Job to `.github/workflows/ci.yml`. It's going to be very similar to our ESLint Job, except it will run our unit tests vs. linter as the final step:
```yml
# modifications to .github/workflows/ci.yml

jobs:
  lint:
    name: ESLint
    runs-on: ubuntu-latest
    steps:
      - name: Check out code
        uses: actions/checkout@v4

      - name: Setup node
        uses: actions/setup-node@v4
        with:
          node-version: 'lts/*'
          cache: 'npm'

      - name: Install node dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    steps:
      - name: Check out code
        uses: actions/checkout@v4

      - name: Setup node
        uses: actions/setup-node@v4
        with:
          node-version: 'lts/*'
          cache: 'npm'

      - name: Install node dependencies and run Tests
        # There are two ways we could do this:
        #
        # 1. Call `npm ci` followed by `npm test` like so (NOTE: the use of | and -):
        # run: |
        # - npm install
        # - npm test
        #
        # 2. Use `install-ci-test` to do it in a single command, see https://docs.npmjs.com/cli/v8/commands/npm-install-ci-test
        # run: npm install-ci-test
        run: npm install-ci-test
```
2. Save and commit
```sh
git add package.json package-lock.json .prettierignore .prettierrc .vscode/settings.json
git commit -m "Write_what_is_change"
```
### Refactor to Use the `response.js` Functions
1. Rewrite all of your HTTP responses to use the `createSuccessResponse()` and `createErrorResponse() `functions in `src/response.js`
  - health check route in src/routes/index.js
  - default error handler in src/app.js
  - code for the GET /v1/fragments route in src/routes/api/get.js
2. Run test
3. Save and commit
```sh
git add package.json package-lock.json .prettierignore .prettierrc .vscode/settings.json
git commit -m "Write_what_is_change"
```
4. push to Git

## Student Information
- Student Name: Shanyun, Wang
- Student ID: 133159228

## Version History
- 2024-09-23 v01.2
  * v01.2 add unit test and ci to github
- 2024-09-16 v01.1
  * v01.1 Add fragments-ui to handle web app, which will allow users to authenticate, and only then can they communicate securely with our back-end web service.
- 2024-09-09 v01
  * version 01 initial

## Acknowledgement
- [DiscussionBorad](https://github.com/humphd/cloud-computing-for-programmers-fall-2024/discussions)
- [Read more about how to configure eslint](https://eslint.org/docs/latest/use/configure/)
- [Use proper Structured Logging](https://developer.ibm.com/blogs/nodejs-reference-architectire-pino-for-logging/) 
- [npmjs](https://www.npmjs.com/)
- [Health Check](https://www.ibm.com/garage/method/practices/manage/health-check-apis/) to determine if the server is accepting requests
- [jq](https://jqlang.github.io/jq/tutorial/)
- AWS
  * [AWS Management Console](https://aws.amazon.com/console/faq-console/)
- Continuous Integration
  * [YAMLYAML](https://en.wikipedia.org/wiki/YAML)
  * [Learn the basics of YAML in a few minutes](https://learnxinyminutes.com/docs/yaml/)
- Unit test
  * [Unit test](https://en.wikipedia.org/wiki/Unit_testing)
  * [Jest](https://jestjs.io/)
  * [Let It Crash: Best Practices for Handling Node.js Errors on Shutdown](https://blog.heroku.com/best-practices-nodejs-errors)
  * [Apache `htpasswd` utility](https://httpd.apache.org/docs/2.4/programs/htpasswd.html)
  * [htpasswd node module](https://github.com/gevorg/htpasswd)
