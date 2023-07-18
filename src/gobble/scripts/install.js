const fs = require("fs");

const utils = require("./../utils.js"),
  next = require("./../libs/next.js"),
  serverless = require("./../libs/serverless.js"),
  ethereum = require("./../libs/ethereum.js");

module.exports.install = () => {
    utils.install();
    serverless.install();
    if (fs.existsSync("./backend/ethereum")) {
      ethereum.install();
    }

    next.install();
};