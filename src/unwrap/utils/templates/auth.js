const inquirer = require("inquirer");

module.exports = { 
    name: 'Auth', 
    createSecrets: async (options) => {
        if (secrets.includes("Yes")) {
            const {
                stage,
                region,
                root_domain_name,
                domain_name,
                s3_bucket,
                s3_key,
                configuration_name
            } = options.secretsFile;
        
            return {
                tf_sls_next_stage: stage,
                tf_sls_next_region: region,
                tf_sls_next_root_domain_name: root_domain_name,
                tf_sls_next_domain_name: domain_name,
                tf_state_s3_bucket: s3_bucket,
                tf_state_s3_key: s3_key,
                tf_sls_service_name: configuration_name
            };
        }
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

        const { configuration_name } = await inquirer.prompt(configuration_name_prompt);
        const { stage } = await inquirer.prompt(stage_prompt);
        const { region } = await inquirer.prompt(region_prompt);
        const { root_domain_name } = await inquirer.prompt(root_domain_name_prompt);
        const { domain_name } = await inquirer.prompt(domain_name_prompt);
        const { s3_bucket } = await inquirer.prompt(s3_bucket_prompt);
        const { s3_key } = await inquirer.prompt(s3_key_prompt);
        
        return {
            configuration_name: configuration_name,
            stage: stage,
            region: region,
            root_domain_name: root_domain_name,
            domain_name: domain_name,
            s3_bucket: s3_bucket,
            s3_key: s3_key,
        };
    }
}

