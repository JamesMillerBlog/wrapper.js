require("@nomiclabs/hardhat-waffle");
const fs = require("fs");

const envVars = JSON.parse(fs.readFileSync("./eth.env.json", "utf8"));

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: "./../../frontend/web3/src/artifacts",
  },
  networks: {
    hardhat: {
      chainId: Number(envVars.localhost_network_id),
    },
    ganache: {
      url: `http://${envVars.local_ip_address}:7545`,
    },
    goerli: {
      url: envVars.network_api_url,
      accounts: [`${envVars.account_private_key}`],
    },
  },
};
