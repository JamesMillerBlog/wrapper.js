const inquirer = require("inquirer");

module.exports = {
    addEthSecrets: async(secretsFile) => {
        const network_prompt = {
            name: "network",
            message:
            "Enter name of the evm based network you would like to deploy your dApp to.",
            default: "goerli",
        };

        const network_api_url_prompt = {
            name: "network_api_url",
            message: "Enter the url for the network you want to deploy your dApp to.",
            default: "https://eth-goerli.g.alchemy.com/v2/your-api-key",
        };

        const account_address_prompt = {
            name: "account_address",
            message:
            "Enter the address for the account that you will use to pay the fees to deploy your dApp.",
            default: "0x123456789E2eb28930eFb4CeF49B2d1F2C9C1199",
        };

        const { network } = await inquirer.prompt(network_prompt);
        const { network_api_url } = await inquirer.prompt(network_api_url_prompt);
        const { account_address } = await inquirer.prompt(account_address_prompt);
        secretsFile.network = network;
        secretsFile.network_api_url = network_api_url;
        secretsFile.account_address = account_address;
    }
}

