/**
 * Dynamically include all routes in a sub directory
 * Credit: https://stackoverflow.com/a/6064205/1589811
 */
const fs = require('fs');

module.exports = function (app) {
  fs.readdirSync(__dirname).forEach(function (file) {
    if (file == "index.js") return;
    let name = file.substr(0, file.indexOf('.'));
    require('./' + name)(app);
  });
}