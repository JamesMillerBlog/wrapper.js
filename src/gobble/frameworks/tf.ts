/* eslint-disable camelcase */
import { error } from "console";
import * as utils from "../utils.js";
import fs from "fs";

export const name = "tf";

export const run = (command: string) => {
  if (!fs.existsSync("./devops/terraform")) {
    utils.error("A Terraform directory does not exist on your project.");
  }
  const tfVarsLocation = "./devops/terraform/terraform.tfvars.json";
  const envVars = JSON.parse(fs.readFileSync(tfVarsLocation, "utf8"));
  if (!envVars) {
    utils.error(
      "Terraform env variables do not exist, please run 'gobble secrets {YOUR-SECRET-NAME} to generate this file"
    );
  }
  if (command === "init") init(envVars);
  else if (command === "plan") plan();
  else if (command === "apply") apply();
  else if (command === "destroy") destroy(envVars);
};

const prepData = (deploymentData: any) => {
  const data = utils.initialConfigPrep(deploymentData, name);
  return JSON.stringify(data, null, 2);
};

export const generateEnv = (deploymentData: any) => {
  try {
    const formattedData = prepData(deploymentData);
    fs.writeFileSync("./devops/terraform/terraform.tfvars.json", formattedData);
    console.log("Created Terraform ENV file");
  } catch (err) {
    error(err);
  }
};

export const init = (deploymentData: { state_s3_bucket: any; region: any }) => {
  const { state_s3_bucket, region } = deploymentData;
  console.log("Running Terraform init command");
  utils.runSyncTerminalCommand(
    `cd ./devops/terraform && terraform init -backend-config "bucket=${state_s3_bucket}" -backend-config "region=${region}" -backend-config "key=terraform.tfstate" -reconfigure`
  );
};

export const plan = () => {
  console.log("Running Terraform plan command");
  utils.runAsyncTerminalCommand(
    `cd ./devops/terraform && terraform plan -var-file="terraform.tfvars.json"`
  );
};

export const apply = () => {
  console.log("Running Terraform apply command");
  utils.runAsyncTerminalCommand(
    `cd ./devops/terraform && terraform apply -var-file="terraform.tfvars.json" -auto-approve`
  );
};

export const destroy = (deploymentData: { domain_name: any }) => {
  const { domain_name } = deploymentData;
  console.log("Destroying Front End App");
  utils.runSyncTerminalCommand(`aws s3 rm s3://${domain_name} --recursive`);

  console.log("Running Terraform destroy command");
  utils.runAsyncTerminalCommand(
    `cd ./devops/terraform && terraform destroy -var-file="terraform.tfvars.json" -auto-approve`
  );
};
