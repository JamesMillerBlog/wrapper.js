const utils = require("../utils.js");
const fs = require("fs");
const internalIp = require("internal-ip");

const name = "eth";

const run = (command) => {
  if (!fs.existsSync("./backend/ethereum")) {
    throw new Error("An Ethereum directory does not exist on your project.");
  }

  if (command === "deploy") {
    const envVarsLocation = "backend/ethereum/eth.env.json";
    const envVars = JSON.parse(fs.readFileSync(envVarsLocation, "utf8"));
    deploy(envVars);
  }
};

const prepData = (deploymentData) => {
  const data = {};

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

const generateEnv = (manuallyCreatedSecrets, terraformGeneratedSecrets) => {
  const deploymentData = {
    ...terraformGeneratedSecrets,
    ...manuallyCreatedSecrets,
  };
  const rawEthData = prepData(deploymentData);
  try {
    fs.writeFileSync("./backend/ethereum/eth.env.json", rawEthData);
    console.log("Created ETH ENV file");
  } catch (err) {
    if (!err.includes("no such file or directory")) {
      console.log(err);
    }
  }
};

const install = () => {
  console.log("Installing Ethereum dependencies");
  utils.runAsyncTerminalCommand(`cd ./backend/ethereum && npm install`);
};

const dev = () => {
  console.log("Running Eth in dev");
  utils.runAsyncTerminalCommand(
    `cd backend/ethereum && npm install && npx hardhat node --hostname 0.0.0.0`,
  );
  utils.runAsyncTerminalCommand(
    `cd backend/ethereum && npm install && npx hardhat compile && npx hardhat run scripts/deploy.js --network localhost`,
  );
};

const deploy = (envVars) => {
  utils.runAsyncTerminalCommand(
    `cd backend/ethereum && npx hardhat compile && npx hardhat run scripts/deploy.js --network ${envVars.network}`,
  );
};

module.exports = {
  run,
  generateEnv,
  install,
  dev,
  deploy,
};
