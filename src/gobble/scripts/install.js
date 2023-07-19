const fs = require("fs");
const { utils } = require("./");
const config = require("../config.js");

const install = () => {
  utils.install();
  config.forEach((c) => {
    if (fs.existsSync(c.filepath)) c.cli.install();
  });
};

module.exports = {
  install,
};
