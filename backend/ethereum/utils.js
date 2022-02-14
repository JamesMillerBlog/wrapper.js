
const utils = require('../utils.js');
module.exports = {
    dev: async() => {
        utils.runAsyncTerminalCommand(
            `npm install && npx hardhat compile && npx hardhat run scripts/deploy.js --network ganache`
        );
    }
};