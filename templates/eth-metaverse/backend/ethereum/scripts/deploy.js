const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, World!");

  const JMBToken = await hre.ethers.getContractFactory("JMBToken");
  const jmbToken = await JMBToken.deploy("James Miller Blog Token", "JMB");

  await greeter.deployed();
  await jmbToken.deployed();

  console.log("Greeter deployed to:", greeter.address);
  console.log("ERC20 Token deployed to:", jmbToken.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });