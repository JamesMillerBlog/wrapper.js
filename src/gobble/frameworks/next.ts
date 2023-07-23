/* eslint-disable camelcase */
import * as utils from "../utils.js";
import fs from "fs";
import internalIp from "internal-ip";

export const name = "next";

export const run = (command: string) => {
  if (!fs.existsSync("./frontend")) {
    throw new Error(
      "A Front End directory for NextJS does not exist on your project."
    );
  }
  if (command === "export") {
    const envVars = JSON.parse(
      fs.readFileSync("devops/terraform/terraform.tfvars.json", "utf8")
    );
    buildAndDeploy(envVars);
  }
};

const prepData = (deploymentData: { [x: string]: any }) => {
  const data = utils.initialConfigPrep(deploymentData, name);

  data.api_local_ip_address = internalIp.v4.sync();
  data.local_api_rest_port = "4000";
  data.local_api_ws_port = "4500";

  return `module.exports = {trailingSlash: true,env: ${JSON.stringify(
    data,
    null,
    2
  )}};`;
};

export const generateEnv = (
  manuallyCreatedSecrets: any,
  terraformGeneratedSecrets: any
) => {
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

export const dev = () => {
  console.log("Running Next.JS in dev");
  utils.runAsyncTerminalCommand(`cd ./frontend && npm install && npm run dev`);
};

export const buildAndDeploy = ({ domain_name }: { domain_name: string }) => {
  console.log("Exporting and deploying Next.JS");
  utils.runSyncTerminalCommand(`cd frontend && npm install && npm run build`);
  utils.runSyncTerminalCommand(`aws s3 rm --recursive s3://${domain_name}`);
  utils.runAsyncTerminalCommand(
    `aws s3 sync ./frontend/out s3://${domain_name}`
  );
};
