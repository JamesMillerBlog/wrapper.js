#!/usr/bin/env node

const dotenv = require('dotenv');
const fs = require('fs');
const cmd = require('node-cmd');
dotenv.config();

const utils = require('./scripts/utils.js'),
    terraform = require('./scripts/terraform.js'),
    next = require('./scripts/next.js'),
    serverless = require('./scripts/serverless.js'),
    ethereum = require('./scripts/ethereum.js');

( async () => {
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
        } else if(leadCommand == 'finished') {
            let secret = subCommand;
            // Check if manually generated secret exists
            if(await utils.secretExists(secret) != false) {
                const {tf_state_s3_bucket} = await utils.getSecrets(secret);
                if(tf_state_s3_bucket) {
                    utils.runSyncTerminalCommand(
                        `aws s3 rm s3://${tf_state_s3_bucket} --recursive`
                    );
    
                    utils.runSyncTerminalCommand(
                        `aws s3api delete-bucket --bucket ${tf_state_s3_bucket}`
                    );
                }
                utils.runSyncTerminalCommand(
                    `aws secretsmanager delete-secret --secret-id ${secret} --force-delete-without-recovery`
                );
            } else {
                if(await utils.secretExists(`${env}${pr}-${secret}`) == false) {
                    throw new Error(`secret ${secret} does not exist`)
                }
            }
        } else if(leadCommand == 'duplicate') {
            let secret = subCommand;
            const duplicate = (process.argv[4]) ? process.argv[4] : null;

            // Check if manually generated secret exists
            if(await utils.secretExists(secret) != false) {
                const secrets = await utils.getSecrets(secret);
                if(duplicate) {
                    let env = '';
                    if(isNaN(duplicate) == false) {
                        env = 'pr-'
                    }
                    const prSecret = secrets;
                    prSecret.tf_sls_service_name = `${env}${duplicate}-${secrets.tf_sls_service_name}`
                    prSecret.tf_sls_next_stage = `${env}${duplicate}`;
                    prSecret.tf_sls_next_domain_name = `${env}${duplicate}.${secrets.tf_sls_next_root_domain_name}`
                    prSecret.tf_state_s3_bucket = `${env}${duplicate}-${secrets.tf_state_s3_bucket}`
                    utils.runSyncTerminalCommand(
                        `aws secretsmanager create-secret --name ${env}${duplicate}-${secret} --secret-string ${JSON.stringify(JSON.stringify(prSecret))}`
                    );
                    if(await utils.secretExists(`${env}${duplicate}-${secret}`) == false) {
                        throw new Error(`new secret ${env}${duplicate}-${secret} not created`)
                    } else {
                        console.log(`secret ${env}${duplicate}-${secret} has been created`)
                    }
                    utils.runSyncTerminalCommand(
                        `aws s3api create-bucket --bucket ${prSecret.tf_state_s3_bucket} --region ${prSecret.tf_sls_next_region} --create-bucket-configuration LocationConstraint=${prSecret.tf_sls_next_region}`
                    )
                    
                }
            } else {
                throw new Error(`secret ${secret} does not exist`)
            }
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
                } else {
                    throw new Error(`secret ${secret} does not exist`)
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