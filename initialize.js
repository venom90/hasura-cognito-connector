// Load Env from .env file
require('dotenv').config();

// util
const { breakLog, currentDateNTime, exitProcess, showInfo, showError, showWarnings } = require('./lib/util');

// Initiate with current timestamp
showInfo(`${currentDateNTime()} Initiating...\n\n`);

// Stacks
const errorStack = [];
const warningStack = [];

// Check required env variables
if (!process.env.COGNITO_USER_POOL_ID) { errorStack.push('Missing env variable: COGNITO_USER_POOL_ID');}
if (!process.env.COGNITO_CLIENT_ID) { errorStack.push('Missing env variable: COGNITO_CLIENT_ID');}
if (!process.env.PORT) { warningStack.push('Missing env variable: PORT. Using default port 3008.');};

// IF initErrors THEN
if (errorStack.length > 0) {
  // Error messages from the stack
  showInfo('Encountered errors while initiating the application! Following are the list of errors.\n\n')
  for (let i = 0; i < errorStack.length; i++) {
    showError(errorStack[i]);
  }
  breakLog();
  showInfo('Please fix above errors to start the application\n\n');
  exitProcess();
} else {
  showInfo('Successfully Initiated.\n');
}

// IF initWarnings THEN
if (warningStack.length > 0) {
  for (let i = 0; i < warningStack.length; i++) {
    showWarnings(warningStack[i]);
  }
  breakLog();
}