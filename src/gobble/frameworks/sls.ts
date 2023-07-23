import * as utils from "../utils.js";
import fs from "fs";
import internalIp from "internal-ip";

export const name = "sls";

export const run = (command: string) => {
  if (!fs.existsSync("./backend/serverless")) {
    throw new Error(
      "A Serverless Framework directory does not exist on your project."
    );
  }
  if (command === "deploy") deploy();
  else if (command === "remove") remove();
};

const prepData = (deploymentData: { [x: string]: any }) => {
  const data = utils.initialConfigPrep(deploymentData, name);

  data.api_local_ip_address = internalIp.v4.sync();
  data.local_api_rest_port = "4000";
  data.local_api_ws_port = "4500";

  return JSON.stringify(data, null, 2);
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
    fs.writeFileSync(
      "./backend/serverless/serverless.env.json",
      prepData(deploymentData)
    );
    console.log("Created SLS ENV file");
  } catch (err) {
    console.log(err);
  }
};

export const dev = () => {
  console.log("Running Serverless in dev");
  utils.runAsyncTerminalCommand(
    `cd ./backend/serverless && npm install && npm run dev`
  );
};

export const deploy = () => {
  console.log("Deploying Serverless backend");
  utils.runAsyncTerminalCommand(
    `cd ./backend/serverless && npm install && npm run deploy`
  );
};

export const remove = () => {
  console.log("Removing Serverless in backend");
  utils.runAsyncTerminalCommand(
    `cd ./backend/serverless && npm install && npm run remove`
  );
};
