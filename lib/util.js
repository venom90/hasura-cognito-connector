const chalk = require('chalk');
const log = console.log;

const util = {
  // Show ERROR msg on CONSOLE
  showError: (msg) => log(chalk.red(`ERROR => ${msg}`)),

  // Show INFO msg on CONSOLE
  showInfo: (msg) => log(chalk.blue(`INFO => ${msg}`)),

  // Line break while logging
  breakLog: () => log('\n\n'),

  // Exit main process
  exitProcess: () => {
    log(chalk.white.bgRed.bold('EXITING PROCESS!'));
    process.exit(1);
  }
}

module.exports = util;