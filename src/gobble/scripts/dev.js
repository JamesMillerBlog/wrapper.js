const fs = require("fs");
const config = require('./../config')

module.exports.dev = () => {
  config.forEach((c) => {
    if(fs.existsSync(c.filepath)) c.cli.dev()
  });
};