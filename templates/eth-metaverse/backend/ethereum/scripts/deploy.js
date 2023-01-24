const hre = require("hardhat");
const fs = require("fs");
const utils = require("./../utils.js");

async function main() {
  const envVars = JSON.parse(fs.readFileSync("./eth.env.json", "utf8"));
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, World!");

  const JMBToken = await hre.ethers.getContractFactory("JMBToken");
  const jmbToken = await JMBToken.deploy("James Miller Blog Token", "JMB");

  await greeter.deployed();
  await jmbToken.deployed();

  console.log("Greeter deployed to:", greeter.address);
  console.log("ERC20 Token deployed to:", jmbToken.address);

  if (deployer.address === envVars.account_address) {
    const JMBTokenArtifact = await import(
      "./../../../frontend/web3/src/artifacts/contracts/ERC20.sol/JMBToken.json",
      {
        assert: { type: "json" },
      }
    );

    const GreeterArtifact = await import(
      "./../../../frontend/web3/src/artifacts/contracts/Greeter.sol/Greeter.json",
      {
        assert: { type: "json" },
      }
    );
    console.log("Updating secret with contract addresses");
    const deployedContracts = {
      greeter: `${greeter.address}`,
      jmbToken: `${jmbToken.address}`,
      jmbTokenArtifact: `${JSON.stringify(JMBTokenArtifact.default)}`,
      greeterArtifact: `${JSON.stringify(GreeterArtifact.default)}`,
    };
    utils.runSyncTerminalCommand(
      `aws secretsmanager create-secret --name ${
        envVars.service_name
      }-contract-deployment-${Date.now()} --secret-string ${JSON.stringify(
        JSON.stringify(deployedContracts)
      )}`
    );
  }
  const localContracts = `{
      "greeter": "${greeter.address}",
      "jmbToken": "${jmbToken.address}"
    }`;
  fs.writeFileSync(
    "./../../frontend/web3/src/artifacts/contracts/addresses.json",
    localContracts
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
