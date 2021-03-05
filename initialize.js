const util = require('./lib/util');

// Set initErrors
let initErrors = false;
const errorStack = [];

// Check required env variables
if (!process.env.COGNITO_USER_POOL_ID) { errorStack.push('Missing env variable: COGNITO_USER_POOL_ID'); initErrors = true; }
if (!process.env.COGNITO_CLIENT_ID) { errorStack.push('Missing env variable: COGNITO_CLIENT_ID'); initErrors = true; }

// IF initErrors THEN
if (initErrors) {
  // Error messages from the stack
  util.showInfo('Showing initial errors!\n\n')
  for (let i = 0; i < errorStack.length; i++) {
    util.showError(errorStack[i]);
  }
  util.breakLog();
  util.showInfo('Please fix above errors to start the application\n\n');
  util.exitProcess();
}
