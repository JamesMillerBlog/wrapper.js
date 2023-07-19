#!/usr/bin/env node
const dotenv = require("dotenv");
dotenv.config();

const { dev, install, finished, duplicate, secrets } = require("./scripts");
const { terraform, serverless, ethereum, next } = require("./libs");

const main = async (argv) => {
  if (argv.length < 3) throw new Error("Enter a valid gobble command");

  const leadCommand = argv[2];
  const subCommand = argv[3] ? argv[3] : null;

  if (leadCommand === "dev") {
    dev();
  } else if (leadCommand === "install") {
    install();
  } else if (leadCommand === "finished") {
    await finished();
  } else if (leadCommand === "duplicate") {
    await duplicate(subCommand, argv);
  } else if (leadCommand === "secrets") {
    await secrets(subCommand);
  } else if (leadCommand === "terraform" || leadCommand === "tf") {
    terraform.run(subCommand);
  } else if ((leadCommand === "serverless") | (leadCommand === "sls")) {
    serverless.run(subCommand);
  } else if (leadCommand === "eth") {
    ethereum.run(subCommand);
  } else if (leadCommand === "next") {
    next.run(subCommand);
  }
};

(async () => main(process.argv))();
