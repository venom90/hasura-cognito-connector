const chalk = require('chalk');
const log = console.log;
const trace = console.trace;

// Show ERROR msg on CONSOLE
exports.showError = (msg) => log(chalk.red(`ERROR => ${msg}`));

// Show WARNING msg on CONSOLE
exports.showWarnings = (msg) => log(chalk.redBright(`WARNING => ${msg}`));

// Show INFO msg on CONSOLE
exports.showInfo = (msg) => log(chalk.blue(`INFO  => ${msg}`));

// Trace error
exports.traceError = (msg) => trace(chalk.red(`ERROR => ${msg}`));

// Line break while logging
exports.breakLog = () => log('\n\n');

// Exit main process
exports.exitProcess = () => {
  log(chalk.white.bgRed.bold('EXITING PROCESS!'));
  process.exit(1);
};

exports.currentDateNTime = () => {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const dateObj = new Date();
  const month = monthNames[dateObj.getMonth()];
  const day = String(dateObj.getDate()).padStart(2, '0');
  const year = dateObj.getFullYear();
  return month + ' ' + day + ',' + year + ' (' + dateObj.getHours() + ':' + dateObj.getMinutes() + ')';
};