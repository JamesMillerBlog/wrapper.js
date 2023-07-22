import * as utils from "../utils";
import fs from "fs";
import internalIp from "internal-ip";

export const name = "eth";

export const run = (command: string) => {
  if (!fs.existsSync("./backend/ethereum")) {
    utils.error("An Ethereum directory does not exist on your project.");
  }

  if (command === "deploy") {
    const envVarsLocation = "backend/ethereum/eth.env.json";
    const envVars = JSON.parse(fs.readFileSync(envVarsLocation, "utf8"));
    deploy(envVars);
  }
};

const prepData = (deploymentData: { [x: string]: any }) => {
  const data: any = {};

  for (const property in deploymentData) {
    if (property.includes(name)) {
      const newKey = property.replace(/eth_/gi, "");
      data[newKey] = deploymentData[property];
    }
  }

  data.local_ip_address = internalIp.v4.sync();
  data.localhost_network_id = "5777";

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
  const rawEthData = prepData(deploymentData);
  try {
    fs.writeFileSync("./backend/ethereum/eth.env.json", rawEthData);
    console.log("Created ETH ENV file");
  } catch (err) {
    if (!String(err).includes("no such file or directory")) {
      console.log(err);
    }
  }
};

export const dev = () => {
  console.log("Running Eth in dev");
  utils.runAsyncTerminalCommand(
    `cd backend/ethereum && npm install && npx hardhat node --hostname 0.0.0.0`
  );
  utils.runAsyncTerminalCommand(
    `cd backend/ethereum && npm install && npx hardhat compile && npx hardhat run scripts/deploy.js --network localhost`
  );
};

export const deploy = (envVars: { network: any }) => {
  utils.runAsyncTerminalCommand(
    `cd backend/ethereum && npx hardhat compile && npx hardhat run scripts/deploy.js --network ${envVars.network}`
  );
};
