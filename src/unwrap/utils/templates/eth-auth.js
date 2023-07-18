const inquirer = require("inquirer");

module.exports = { 
    name: 'Eth-Auth', 
    createSecrets: async (options) => {
        const {
            stage,
            region,
            root_domain_name,
            domain_name,
            s3_bucket,
            s3_key,
            configuration_name,
            network,
            network_api_url,
            account_address,
        } = options.secretsFile;

          return {
            tf_sls_next_stage: stage,
            tf_sls_next_region: region,
            tf_sls_next_root_domain_name: root_domain_name,
            tf_sls_next_domain_name: domain_name,
            tf_state_s3_bucket: s3_bucket,
            tf_state_s3_key: s3_key,
            eth_tf_sls_service_name: configuration_name,
            eth_network: network,
            eth_network_api_url: network_api_url,
            eth_account_address: account_address
        };
    },
    requestConfiguration: async() => {
        const configuration_name_prompt = {
            name: "configuration_name",
            message:
                "Enter a name for your wrapper configuration, this will set: the name of your secret, service for Serverless Framework and the Terraform generated secrets name.",
            default: "wrapperjs",
            validate,
        };
    
        const stage_prompt = {
            name: "stage",
            message:
                "Enter the stage for your Serverless Framework and Terraform service.",
            default: "dev",
            validate,
        };
    
        const region_prompt = {
            name: "region",
            message:
                "Enter the region you want Serverless Framework and Terraform to create your AWS resources.",
            default: "eu-west-2",
            validate,
        };
    
        const root_domain_name_prompt = {
            name: "root_domain_name",
            message:
                "Enter a domain name you own, with an existing hosted zone in route53",
            default: "jamesmiller.blog",
            validate: validateNotJMB,
        };
    
        const domain_name_prompt = {
            name: "domain_name",
            message:
                "Enter the subdomain you'd like terraform to create for you in your already existing hosted zone.",
            default: "dev.jamesmiller.blog",
            validate: validateNotJMB,
        };
    
        const s3_bucket_prompt = {
            name: "s3_bucket",
            message:
                "Enter the name of the s3 bucket you'd like Wrapper.js to create for your terraform state file.",
            default: "wrapperjs.jamesmiller.blog",
            validate: validateNotJMB,
        };
    
        const s3_key_prompt = {
            name: "s3_key",
            message:
                "Enter name of tf state file you would like to be created in your s3 bucket",
            default: "terraform.tfstate",
        };

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

        const { configuration_name } = await inquirer.prompt(configuration_name_prompt);
        const { stage } = await inquirer.prompt(stage_prompt);
        const { region } = await inquirer.prompt(region_prompt);
        const { root_domain_name } = await inquirer.prompt(root_domain_name_prompt);
        const { domain_name } = await inquirer.prompt(domain_name_prompt);
        const { s3_bucket } = await inquirer.prompt(s3_bucket_prompt);
        const { s3_key } = await inquirer.prompt(s3_key_prompt);
        const { network } = await inquirer.prompt(network_prompt);
        const { network_api_url } = await inquirer.prompt(network_api_url_prompt);
        const { account_address } = await inquirer.prompt(account_address_prompt);
        
        return {
            configuration_name,
            stage,
            region,
            root_domain_name,
            domain_name,
            s3_bucket,
            s3_key,
            network,
            network_api_url,
            account_address

        };
    }
}

