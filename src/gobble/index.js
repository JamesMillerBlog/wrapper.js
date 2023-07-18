#!/usr/bin/env node
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    terraform: require("./scripts/tf"),
    serverless: require("./scripts/sls"),
    ethereum: require("./scripts/eth"),
    next: require("./scripts/next"),
    dev: require("./scripts/dev"),
    install: require("./scripts/install"),
    finished: require("./scripts/finished"),
    duplicate: require("./scripts/duplicate"),
    secrets: require("./scripts/secrets"),
    config: require("./config"),
    main: require("./main.js")
};

(async () => this.main(process.argv))(process);
