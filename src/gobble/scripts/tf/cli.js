const utils = require('../utils.js'),
    fs = require('fs');


module.exports = {

    // **************************
    //      GOBBLE COMMANDS
    // **************************

    run: (command) => {
        if(fs.existsSync("./devops/terraform")) {
            const tfVarsLocation = './devops/terraform/terraform.tfvars.json';
            const envVars = JSON.parse(fs.readFileSync(tfVarsLocation, "utf8"));
            if (command == "init") terraform.init(envVars);
            else if (command == "plan") terraform.plan();
            else if (command == "apply") terraform.apply();
            else if (command == "destroy") terraform.destroy(envVars);
        } else {
            throw new Error('A Terraform directory does not exist on your project.')
        }
    },

    // **************************
    //       GENERATE ENV
    // **************************
    
    generateEnv: (deploymentData) => {
        try {
            fs.writeFileSync('./devops/terraform/terraform.tfvars.json', utils.prepData(deploymentData, "tf"));
            console.log('Created Terraform ENV file');
        } catch (err) {
            console.log(err);
        }
    },

    // **************************
    //       INIT TERRAFORM
    // **************************

    init: (deploymentData) => {
        const { state_s3_bucket, region } = deploymentData;
        console.log('Running Terraform init command');
        utils.runSyncTerminalCommand(
            `cd ./devops/terraform && terraform init -backend-config "bucket=${state_s3_bucket}" -backend-config "region=${region}" -backend-config "key=terraform.tfstate" -reconfigure`
        );
    },

    // **************************
    //      PLAN ENVIRONMENT
    // **************************

    plan: () => {
        console.log('Running Terraform plan command');
        utils.runAsyncTerminalCommand(
            `cd ./devops/terraform && terraform plan -var-file="terraform.tfvars.json"`
        );
    },
    
    // ***************************
    // CREATE / UPDATE ENVIRONMENT
    // ***************************

    apply: () => {            
        console.log('Running Terraform apply command');
        utils.runAsyncTerminalCommand(
            `cd ./devops/terraform && terraform apply -var-file="terraform.tfvars.json" -auto-approve`
        );
    },

    // ***************************
    //     DESTROY ENVIRONMENT
    // ***************************

    destroy: (deploymentData) => {

        const { domain_name, state_s3_bucket } = deploymentData;
        console.log('Destroying Front End App');
        utils.runSyncTerminalCommand(
            `aws s3 rm s3://${domain_name} --recursive`
        );

        console.log('Running Terraform destroy command');
        utils.runAsyncTerminalCommand(
            `cd ./devops/terraform && terraform destroy -var-file="terraform.tfvars.json" -auto-approve`
        );
    }
}

