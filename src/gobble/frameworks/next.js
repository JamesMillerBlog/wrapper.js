/* eslint-disable camelcase */
const utils = require("../utils.js");
const fs = require("fs");
const internalIp = require("internal-ip");
const { initialConfigPrep } = require("./../utils");

const name = "next";

const run = (command) => {
  if (!fs.existsSync("./frontend")) {
    throw new Error(
      "A Front End directory for NextJS does not exist on your project.",
    );
  }
  if (command === "export") {
    // build and deploy app
    const envVars = JSON.parse(
      fs.readFileSync("devops/terraform/terraform.tfvars.json", "utf8"),
    );
    buildAndDeploy(envVars);
  }
};

const prepData = (deploymentData) => {
  const data = initialConfigPrep(deploymentData, name);

  data.api_local_ip_address = internalIp.v4.sync();
  data.local_api_rest_port = "4000";
  data.local_api_ws_port = "4500";

  return `module.exports = {trailingSlash: true,env: ${JSON.stringify(
    data,
    null,
    2,
  )}};`;
};

const generateEnv = (manuallyCreatedSecrets, terraformGeneratedSecrets) => {
  const deploymentData = {
    ...terraformGeneratedSecrets,
    ...manuallyCreatedSecrets,
  };
  try {
    fs.writeFileSync("./frontend/next.config.js", prepData(deploymentData));
    console.log("Created NextJS ENV file");
  } catch (err) {
    console.log(err);
  }
};

const install = () => {
  console.log("Installing Next.JS dependencies");
  utils.runAsyncTerminalCommand(`cd ./frontend && npm install`);
};

const dev = () => {
  console.log("Running Next.JS in dev");
  utils.runAsyncTerminalCommand(`cd ./frontend && npm install && npm run dev`);
};

const buildAndDeploy = (deploymentData) => {
  console.log("Exporting and deploying Next.JS");
  const { domain_name } = deploymentData;
  console.log(domain_name);
  utils.runSyncTerminalCommand(`cd frontend && npm install && npm run build`);
  utils.runSyncTerminalCommand(`aws s3 rm --recursive s3://${domain_name}`);
  utils.runAsyncTerminalCommand(
    `aws s3 sync ./frontend/out s3://${domain_name}`,
  );
};

module.exports = {
  run,
  generateEnv,
  install,
  dev,
  buildAndDeploy,
};
