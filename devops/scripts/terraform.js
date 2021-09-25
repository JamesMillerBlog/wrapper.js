const utils = require('./utils.js'),
    fs = require('fs');


module.exports = {

    // **************************
    //       INIT TERRAFORM
    // **************************

    init: (deploymentData) => {
        const { terraform_state_s3_bucket, terraform_sls_next_region } = deploymentData;

        fs.writeFile('./devops/terraform/terraform.tfvars.json', utils.prepData(deploymentData, "terraform"), (err) => {
            if (err) throw err;
            console.log('TF VARS file updated');

            utils.runSyncTerminalCommand(
                `cd ./devops/terraform && terraform init -backend-config "bucket=${terraform_state_s3_bucket}" -backend-config "region=${terraform_sls_next_region}" -backend-config "key=terraform.tfstate" -reconfigure`
            );
        });
    },

    // **************************
    //      PLAN ENVIRONMENT
    // **************************

    plan: (deploymentData) => {
        module.exports.init(deploymentData);

        utils.runAsyncTerminalCommand(
            `cd ./devops/terraform && terraform plan -var-file="terraform.tfvars.json"`
        );
    },
    
    // ***************************
    // CREATE / UPDATE ENVIRONMENT
    // ***************************

    apply: (deploymentData) => {
        module.exports.init(deploymentData);
            
        utils.runAsyncTerminalCommand(
            `cd ./devops/terraform && terraform apply -var-file="terraform.tfvars.json" -auto-approve`
        );
    },

    // ***************************
    //     DESTROY ENVIRONMENT
    // ***************************

    destroy: (deploymentData) => {

        const { terraform_sls_next_domain_name } = deploymentData;

        utils.runSyncTerminalCommand(
            `aws s3 rm s3://${terraform_sls_next_domain_name} --recursive`
        );

        utils.runAsyncTerminalCommand(
            `cd ./devops/terraform && terraform destroy -var-file="terraform.tfvars.json" -auto-approve`
        );

    }
}

