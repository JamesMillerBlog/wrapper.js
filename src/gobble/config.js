module.exports.config = [
  {
    filepath: "./frontend",
    cli: require("../next/cli.js"),
  },
  {
    filepath: "./backend/serverless",
    cli: require("../sls/cli.js"),
  },
  {
    filepath: "./backend/ethereum",
    cli: require("../eth/cli.js"),
  },
];
