const fs = require("fs");
const config = require("../config");

const dev = () => {
  config.forEach((c) => {
    if (fs.existsSync(c.filepath)) c.cli.dev();
  });
};

module.exports = {
  dev,
};
