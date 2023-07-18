const fs = require("fs");
const utils = require("./utils.js");
const config = require('./../config')

module.exports.install = () => {
  utils.install();
  config.forEach((c) => {
    if(fs.existsSync(c.filepath)) c.cli.install()
  });
};