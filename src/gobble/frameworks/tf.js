/* eslint-disable camelcase */
const utils = require("../utils.js");
const fs = require("fs");
const { initialConfigPrep } = require("./../utils");

const name = "tf";

const run = (command) => {
  if (!fs.existsSync("./devops/terraform")) {
    throw new Error("A Terraform directory does not exist on your project.");
  }
  const tfVarsLocation = "./devops/terraform/terraform.tfvars.json";
  const envVars = JSON.parse(fs.readFileSync(tfVarsLocation, "utf8"));
  if (command === "init") init(envVars);
  else if (command === "plan") plan();
  else if (command === "apply") apply();
  else if (command === "destroy") destroy(envVars);
};

const prepData = (deploymentData) => {
  const data = initialConfigPrep(deploymentData, name);

  return JSON.stringify(data, null, 2);
};

const generateEnv = (deploymentData) => {
  try {
    fs.writeFileSync(
      "./devops/terraform/terraform.tfvars.json",
      prepData(deploymentData),
    );
    console.log("Created Terraform ENV file");
  } catch (err) {
    console.log(err);
  }
};

const init = (deploymentData) => {
  const { state_s3_bucket, region } = deploymentData;
  console.log("Running Terraform init command");
  utils.runSyncTerminalCommand(
    `cd ./devops/terraform && terraform init -backend-config "bucket=${state_s3_bucket}" -backend-config "region=${region}" -backend-config "key=terraform.tfstate" -reconfigure`,
  );
};

const plan = () => {
  console.log("Running Terraform plan command");
  utils.runAsyncTerminalCommand(
    `cd ./devops/terraform && terraform plan -var-file="terraform.tfvars.json"`,
  );
};

const apply = () => {
  console.log("Running Terraform apply command");
  utils.runAsyncTerminalCommand(
    `cd ./devops/terraform && terraform apply -var-file="terraform.tfvars.json" -auto-approve`,
  );
};

const destroy = (deploymentData) => {
  const { domain_name } = deploymentData;
  console.log("Destroying Front End App");
  utils.runSyncTerminalCommand(`aws s3 rm s3://${domain_name} --recursive`);

  console.log("Running Terraform destroy command");
  utils.runAsyncTerminalCommand(
    `cd ./devops/terraform && terraform destroy -var-file="terraform.tfvars.json" -auto-approve`,
  );
};

module.exports = {
  run,
  generateEnv,
  init,
  plan,
  apply,
  destroy,
};
