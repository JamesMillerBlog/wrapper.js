#!/usr/bin/env node

const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();

const utils = require('./scripts/utils.js'),
    terraform = require('./scripts/terraform.js'),
    next = require('./scripts/next.js'),
    serverless = require('./scripts/serverless.js'),
    ethereum = require('./scripts/ethereum.js');

( async () => {
    const awsCredentials = {
        region: process.env.AWS_REGION,
        access_key_id: process.env.AWS_ACCESS_KEY_ID,
        secret_access_key: process.env.AWS_SECRET_ACCESS_KEY
    };
    
    if(process.argv.length > 2) {
        const leadCommand = process.argv[2];
        const subCommand = (process.argv[3]) ? process.argv[3] : null;
        if(leadCommand == 'dev') {
            serverless.dev();
            // ethereum.dev();
            next.dev();
        } else if(leadCommand == 'install') {
            utils.install();
            serverless.install();
            // ethereum.install();
            next.install();
        } else {
            if(leadCommand == 'secrets') { 
                let secret = subCommand;
                // Check if manually generated secret exists
                if(await utils.secretExists(secret) != false) {
                    try {
                        // generate ENV files for terraform frameworks
                        const manuallyCreatedSecrets = await utils.getSecrets(secret);
                        terraform.generateEnv(manuallyCreatedSecrets);
                        const { tf_sls_service_name } = manuallyCreatedSecrets;
                        // check if terraform generated secrets exist
                        if(tf_sls_service_name && await utils.secretExists(`${tf_sls_service_name}-tf`) != false) {
                            // generate ENV files for next & sls frameworks
                            const terraformGeneratedSecrets = await utils.getSecrets(`${tf_sls_service_name}-tf`);
                            next.generateEnv(manuallyCreatedSecrets, terraformGeneratedSecrets);
                            serverless.generateEnv(manuallyCreatedSecrets, terraformGeneratedSecrets);
                            // ethereum.generateEnv(manuallyCreatedSecrets, terraformGeneratedSecrets);
                        } else {
                            console.log('Congrats, Terraform files have been generated!\n');
                            console.log('Next step, run Terraform commands to create AWS resources.');
                            console.log("Once you've created your Terraform resources, rerun this command to generate secrets that can be used for the Back End and Front End.")
                        }
                    }
                    catch (e) {
                        throw new Error(e)
                    }
                }
            } else if(leadCommand == 'terraform' || leadCommand == 'tf') {
                const envVars = JSON.parse(fs.readFileSync('./devops/terraform/terraform.tfvars.json', 'utf8'));
                if (subCommand == 'init') {
                    // create terraform environment
                    terraform.init(envVars);
                } else if (subCommand == 'plan') {
                    // plan terraform
                    terraform.plan();
                } else if (subCommand == 'apply') {
                    // build and deploy app
                    terraform.apply();
                } else if (subCommand == 'destroy') {
                    // destroy app
                    terraform.destroy(envVars);
                } 
            } else if(leadCommand == 'serverless' | leadCommand == 'sls') {
                if (subCommand == 'deploy') {
                    // build and deploy back end
                    serverless.deploy();
                } else if (subCommand == 'remove') {
                    // build and deploy back end
                    serverless.remove();
                } 
            } else if (leadCommand == 'eth') {
                if (subCommand == 'deploy') {
                    // build and deploy eth
                    const envVars = JSON.parse(fs.readFileSync('backend/ethereum/eth.env.json', 'utf8'));
                    ethereum.deploy(envVars);
                }
            } else if (leadCommand == 'next') {
                if (subCommand == 'export') {
                    // build and deploy app
                    const envVars = JSON.parse(fs.readFileSync('devops/terraform/terraform.tfvars.json', 'utf8'));
                    next.buildAndDeploy(envVars);
                }
            }
        }
    }
})(process);

// unwrap commands = setting up wrapper.js with scaffolding tools
// gobble commands = development commands

// gobble secrets client-project-dev
// gobble next export
// gobble terraform destroy
// gobble terraform init
// gobble terraform apply

/*
   Get private key json from docker:
   1. docker exec -it ec2-user_geth-bootnode_1 sh
   2. cd ~/.ethereum/keystore
   3. ls
   4. cat ${selected file} 
   5. copy json into file (keep original name from file) and upload to metamask
*/