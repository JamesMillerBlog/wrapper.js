const fs = require("fs");

const next = require("./next/cli.js"),
  serverless = require("./sls/cli.js"),
  ethereum = require("./eth/cli.js");

module.exports.dev = () => {
    if (fs.existsSync("./backend/serverless")) serverless.dev();
    if (fs.existsSync("./backend/ethereum")) ethereum.dev();
    if (fs.existsSync("./frontend")) next.dev();
};