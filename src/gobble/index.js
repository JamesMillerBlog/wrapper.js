#!/usr/bin/env node
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

const terraform = require("./scripts/tf"),
  serverless = require("./scripts/sls"),
  ethereum = require("./scripts/eth"),
  next = require("./scripts/next"),
  dev = require("./scripts/dev"),
  install = require("./scripts/install"),
  finished = require("./scripts/finished"),
  duplicate = require("./scripts/duplicate"),
  secrets = require("./scripts/secrets");

(async () => {
  if (process.argv.length < 3) throw new Error('Enter a valid gobble command (e.g dev)');
  
  const leadCommand = process.argv[2];
  const subCommand = process.argv[3] ? process.argv[3] : null;
  if (leadCommand == "dev") {
    dev();
  } else if (leadCommand == "install") {
    install();
  } else if (leadCommand == "finished") {
    await finished();
  } else if (leadCommand == "duplicate") {
    await duplicate(subCommand);
  } else if (leadCommand == "secrets") {
    await secrets();
  } else if (leadCommand == "terraform" || leadCommand == "tf") {
    terraform.run(subCommand);
  } else if (leadCommand == "serverless" | leadCommand == "sls") {
    serverless.run(subCommand)
  } else if (leadCommand == "eth") {
    ethereum.run(subCommand);
  } else if (leadCommand == "next") {
    next.run(subCommand);
  }
})(process);
