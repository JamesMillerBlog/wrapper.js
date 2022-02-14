const dotenv = require('dotenv');
const fs = require('fs');
const { execPath } = require('process');
dotenv.config();

const utils = require('./devops/scripts/utils.js'),
    terraform = require('./devops/scripts/terraform.js'),
    next = require('./devops/scripts/next.js'),
    serverless = require('./devops/scripts/serverless.js'),
    ethereum = require('./devops/scripts/ethereum.js');

const awsCredentials = {
    region: process.env.AWS_REGION,
    access_key_id: process.env.AWS_ACCESS_KEY_ID,
    secret_access_key: process.env.AWS_SECRET_ACCESS_KEY
};
// **************************
//  LOGIC TO TRIGGER PROCESS
// **************************

( async () => {
    // run dev env
    if (process.argv.includes('dev')) {
        utils.dev();
    } else if(process.argv.includes('installAll')) {
        utils.install();
    } else {
        if(fs.existsSync('.env')) {
            utils.awsAccessSetup(awsCredentials);    
        } else {
            console.log('No .env file detected, expect errors if no AWS credentials are present - unless this is being run in the CD pipeline.')
        }
        if (process.argv.includes('generateEnvVars')) {
            // generate ENV files for terraform frameworks
            const manuallyCreatedSecrets = await utils.getSecrets(`${process.env.npm_config_client}-${process.env.npm_config_project}-${process.env.npm_config_environment}`);
            terraform.generateEnv(manuallyCreatedSecrets);
            // generate ENV files for next & sls frameworks
            const terraformGeneratedSecrets = await utils.getSecrets(`${process.env.npm_config_client}-${process.env.npm_config_project}-${process.env.npm_config_environment}-tf`);
            next.generateEnv(manuallyCreatedSecrets, terraformGeneratedSecrets);
            serverless.generateEnv(manuallyCreatedSecrets, terraformGeneratedSecrets);
            ethereum.generateEnv(manuallyCreatedSecrets, terraformGeneratedSecrets);
        } else {
            const envVars = JSON.parse(fs.readFileSync('devops/terraform/terraform.tfvars.json', 'utf8'));
            if (process.argv.includes('terraformInit')) {
            //     create terraform environment
                console.log(envVars);
                terraform.init(envVars);
            } else if (process.argv.includes('terraformPlan')) {
                terraform.init(envVars);
                terraform.plan();
            // build and deploy app
            } else if (process.argv.includes('terraformApply')) {
                terraform.init(envVars);
                terraform.apply();
            // build and deploy app
            } else if (process.argv.includes('deployApp')) {
                next.buildAndDeploy(envVars);
            // // destroy environment
            } else if (process.argv.includes('destroyEnv')) {
                terraform.init(envVars);
                terraform.destroy(envVars);
            }
            // deploy serverless environment
            else if (process.argv.includes('slsDeploy')) {
                serverless.deploy();
            // build and deploy app
            } else if (process.argv.includes('ethDeploy')) {
                const envVars = JSON.parse(fs.readFileSync('backend/ethereum/eth.env.json', 'utf8'));
                ethereum.deploy(envVars);
            } 
            else if (process.argv.includes('slsRemove')) {
                serverless.remove();
            } 
        } 
        // if (process.argv.includes('generateTfEnvVars')) {
        //     // generate ENV files for terraform frameworks
        //     const manuallyCreatedSecrets = await utils.getSecrets(`${process.env.npm_config_client}-${process.env.npm_config_project}-${process.env.npm_config_environment}`);
        //     terraform.generateEnv(manuallyCreatedSecrets);
        // // } else if (process.argv.includes('generateEnvVars')) {
        // } 
    }
})();

// npm run generateEnvVars --client=client --project=project --environment=dev
// npm run deployApp --client=client --project=project --environment=dev
// npm run destroyEnv --client=client --project=project --environment=dev

// terraform init -backend-config=environments/client/arena/dev/backend.hcl
// terraform apply -var client = "client" -var project = "project" -var environment = "stage"


/*
   Get private key json from docker:
   1. docker exec -it ec2-user_geth-bootnode_1 sh
   2. cd ~/.ethereum/keystore
   3. ls
   4. cat ${selected file} 
   5. copy json into file (keep original name from file) and upload to metamask
*/