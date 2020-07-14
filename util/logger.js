const chalk = require('chalk');
const moment = require('moment');

const colors = {
  log: chalk.bgBlue,
  warn: chalk.black.bgYellow,
  error: chalk.bgRed,
  debug: chalk.green,
  cmd: chalk.black.bgWhite,
  ready: chalk.black.bgGreen
};

const log = (type, ...content) => {
  // eslint-disable-next-line no-prototype-builtins
  if (!colors.hasOwnProperty(type.toLowerCase())) throw new TypeError(`Logger type must be one of ${Object.getOwnPropertyNames(colors)}`);
  const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
  console.log(timestamp, colors[type](type.toUpperCase()), ...content);
};

/**
 * A logger class for nice coloured logging
 */
module.exports = Object.assign({}, ...Object.getOwnPropertyNames(colors).map(type => ({
  // This is probably the funniest JavaScript I've ever written
  [type](...content) { log(type, ...content); }
})));
