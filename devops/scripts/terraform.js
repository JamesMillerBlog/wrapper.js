const utils = require('./utils.js'),
    fs = require('fs');


module.exports = {

    // **************************
    //       GENERATE ENV
    // **************************
    
    generateEnv: (deploymentData) => {
        try {
            fs.writeFileSync('./devops/terraform/terraform.tfvars.json', utils.prepData(deploymentData, "tf"));
            console.log('Terraform ENV file updated');
        } catch (err) {
            console.log(err);
        }
    },

    // **************************
    //       INIT TERRAFORM
    // **************************

    init: (deploymentData) => {
        const { state_s3_bucket, region } = deploymentData;
        utils.runSyncTerminalCommand(
            `cd ./devops/terraform && terraform init -backend-config "bucket=${state_s3_bucket}" -backend-config "region=${region}" -backend-config "key=terraform.tfstate" -reconfigure`
        );
        
    },

    // **************************
    //      PLAN ENVIRONMENT
    // **************************

    plan: () => {
        utils.runAsyncTerminalCommand(
            `cd ./devops/terraform && terraform plan -var-file="terraform.tfvars.json"`
        );
    },
    
    // ***************************
    // CREATE / UPDATE ENVIRONMENT
    // ***************************

    apply: () => {            
        utils.runAsyncTerminalCommand(
            `cd ./devops/terraform && terraform apply -var-file="terraform.tfvars.json" -auto-approve`
        );
    },

    // ***************************
    //     DESTROY ENVIRONMENT
    // ***************************

    destroy: (deploymentData) => {

        const { domain_name } = deploymentData;

        utils.runSyncTerminalCommand(
            `aws s3 rm s3://${domain_name} --recursive`
        );

        utils.runAsyncTerminalCommand(
            `cd ./devops/terraform && terraform destroy -var-file="terraform.tfvars.json" -auto-approve`
        );

    }
}

