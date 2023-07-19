const utils = require("../utils.js");
const fs = require("fs");
const internalIp = require("internal-ip");
const { initialConfigPrep } = require("./../utils");

const name = "sls";

const run = (command) => {
  if (!fs.existsSync("./backend/serverless")) {
    throw new Error(
      "A Serverless Framework directory does not exist on your project.",
    );
  }
  if (command === "deploy") deploy();
  else if (command === "remove") remove();
};

const prepData = (deploymentData) => {
  const data = initialConfigPrep(deploymentData, name);

  data.api_local_ip_address = internalIp.v4.sync();
  data.local_api_rest_port = "4000";
  data.local_api_ws_port = "4500";

  return JSON.stringify(data, null, 2);
};

const generateEnv = (manuallyCreatedSecrets, terraformGeneratedSecrets) => {
  const deploymentData = {
    ...terraformGeneratedSecrets,
    ...manuallyCreatedSecrets,
  };

  try {
    fs.writeFileSync(
      "./backend/serverless/serverless.env.json",
      prepData(deploymentData, "sls"),
    );
    console.log("Created SLS ENV file");
  } catch (err) {
    console.log(err);
  }
};

const install = () => {
  console.log("Installing Serverless dependencies");
  utils.runAsyncTerminalCommand(`cd ./backend/serverless && npm install`);
};

const dev = () => {
  console.log("Running Serverless in dev");
  utils.runAsyncTerminalCommand(
    `cd ./backend/serverless && npm install && npm run dev`,
  );
};

const deploy = () => {
  console.log("Deploying Serverless backend");
  utils.runAsyncTerminalCommand(
    `cd ./backend/serverless && npm install && npm run deploy`,
  );
};

const remove = () => {
  console.log("Removing Serverless in backend");
  utils.runAsyncTerminalCommand(
    `cd ./backend/serverless && npm install && npm run remove`,
  );
};

module.exports = {
  name,
  run,
  generateEnv,
  install,
  dev,
  deploy,
  remove,
};
