const utils = require('./utils.js'),
    fs = require('fs');

module.exports = {

    // **************************
    //       GENERATE ENV
    // **************************
    
    generateEnv: (manuallyCreatedSecrets, terraformGeneratedSecrets) => {
        const deploymentData = { ...terraformGeneratedSecrets, ...manuallyCreatedSecrets };
        const rawEthData =  utils.prepData(deploymentData, "eth");
        const ethData = JSON.parse(rawEthData);
        const envEthData = `
# The ID of Ethereum Network
NETWORK_ID=${ethData.chain_network_id}

# The password to create and access the primary account
ACCOUNT_PASSWORD=${ethData.chain_account_password}
        `
        const genesisData = `
{
    "config": {
        "chainId": ${ethData.chain_network_id},
        "homesteadBlock": 0,
        "eip150Block": 0,
        "eip155Block": 0,
        "eip158Block": 0,
        "byzantiumBlock": 0,
        "constantinopleBlock": 0,
        "petersburgBlock": 0,
        "ethash": {}
    },
    "difficulty": "1",
    "gasLimit": "12000000",
    "alloc": {}
}
        `
        try {
            fs.writeFileSync('./backend/ethereum/eth.env.json', rawEthData);
            fs.writeFileSync('./backend/ethereum/blockchain/.env', envEthData);
            fs.writeFileSync('./backend/ethereum/blockchain/genesis.json', genesisData);
            console.log('ETH ENV file updated');
        } catch (err) {
            console.log(err);
        }
    },

    install: () => {
        utils.runAsyncTerminalCommand(
            `cd ./backend/ethereum && npm install`
        );
    },
    
    dev: () => {
        utils.runAsyncTerminalCommand(
            `cd backend/ethereum && npm install && npx hardhat node`
        );
        utils.runAsyncTerminalCommand(
            `cd backend/ethereum && npm install && npx hardhat compile && npx hardhat run scripts/deploy.js --network localhost`
        );
    },

    // **************************
    //       DEPLOY LAMBDAS
    // **************************
    
    deploy: (envVars) => {
        utils.runAsyncTerminalCommand(
            `cd backend/ethereum && npx hardhat compile && npx hardhat run scripts/deploy.js --network ${envVars.stage}`
        );
    },


    // **************************
    //    DESTROY ENVIRONMENT
    // **************************

    remove: () => {  
       
    }
}
