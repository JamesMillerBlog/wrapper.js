const cmd = require("node-cmd");
module.exports = {
  dev: async () => {
    module.exports.runAsyncTerminalCommand(`npm install && npx hardhat node`);
    module.exports.runAsyncTerminalCommand(
      `npm install && npx hardhat compile && npx hardhat run scripts/deploy.js --network localhost`
    );
    // utils.runAsyncTerminalCommand(
    //     `npm install && npx hardhat compile && npx hardhat run scripts/deploy.js --network ganache`
    // );
  },
  runSyncTerminalCommand(terminalCommand) {
    let command = cmd.runSync(terminalCommand);
    console.log("Started running a command");
    console.log(terminalCommand);
    if (command.err) {
      console.log(`Sync Err ${command.err}`);
      throw new Error(command.err);
    } else if (command.stderr) {
      console.log(`Sync stderr: ${command.stderr}`);
      throw new Error(command.stderr);
    }

    console.log(command.data);
  },
};
