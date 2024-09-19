# CCP555 NSA course - fragments API
This guide outlines setting up a Node.js-based REST API using Express for the CCP555 NSA course. The API, Fragments, is developed using best practices for logging, code formatting, and linting. The guide walks through Git usage, setting up the development environment, and configuring tools like Prettier, ESLint, and structured logging with Pino.

## Git Command
- Avoid using `git add .`, it will add files and folders you don't expect.
- `git status` to see which files changed
- `git add ..` to add which files changed
- `git commit -m "What_change"` to leave comment to which files changed

## Run Server
- To run server, use command: `npm start`
> NOTE:`npm run dev`: for developer, and `npm run debug`: for debug
- Access the application in a browser: `http://localhost:8080`

## Test
- npm run test:watch
- npm test

## Continuous Integration (CI)
- You never leave CI in a **broken state**, the source tree must always stay **green**


## Structure and Route Information
```bash
fragements/
├── .aws/
│   ├── credentials    # Store your AWS credentials     
├── .vscode/
│   ├── launch.json    # To connect a debugger     
│   ├── settings.json  # Sepcific settings       
├── node_modules/
├── src/
│   ├── routes/
│   │  ├─ api/
│   │  │  ├─ get.js    # Get a list of current user
│   │  │  ├─ index.js  # Define our routes here
│   │  ├─ index.js     # Access to api folder
│   ├── app.js         # Express app configuration
│   ├── auth.js        # Define our Passport strategy and authentication
│   ├── index.js       # Server entry point with .env
│   ├── logger.js      # To log various types of information
│   ├── server.js      # Server entry point
├── .env               # Stroe credentails
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
4. These credentials show be kept secret, DO NOT SHARE!
> NOTE: Your Account credentials (e.g., session token) will change each time you start and stop the lab environment.
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
    * Password policy options: Cognito default
    * Multi-factor authentication: No MFA
    * Self-service account recovery: Enable self-service account recovery
    * Delivery method for user account recovery messages: Email Only
  - Step 3: Configure sign-up experience
    * Self-registration: Enable self-registration
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
We create a simple web app for testing our microservice. [Repo](https://github.com/swang308/fragments-ui)
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

## CI
## Unit Test

## Student Information
- Student Name: Shanyun, Wang
- Student ID: 133159228

## Version History
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
