"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroy = exports.apply = exports.plan = exports.init = exports.generateEnv = exports.run = exports.name = void 0;
/* eslint-disable camelcase */
const utils = __importStar(require("../utils.js"));
const fs_1 = __importDefault(require("fs"));
exports.name = "tf";
const run = (command) => {
    if (!fs_1.default.existsSync("./devops/terraform")) {
        throw new Error("A Terraform directory does not exist on your project.");
    }
    const tfVarsLocation = "./devops/terraform/terraform.tfvars.json";
    const envVars = JSON.parse(fs_1.default.readFileSync(tfVarsLocation, "utf8"));
    if (command === "init")
        (0, exports.init)(envVars);
    else if (command === "plan")
        (0, exports.plan)();
    else if (command === "apply")
        (0, exports.apply)();
    else if (command === "destroy")
        (0, exports.destroy)(envVars);
};
exports.run = run;
const prepData = (deploymentData) => {
    const data = utils.initialConfigPrep(deploymentData, exports.name);
    return JSON.stringify(data, null, 2);
};
const generateEnv = (deploymentData) => {
    try {
        fs_1.default.writeFileSync("./devops/terraform/terraform.tfvars.json", prepData(deploymentData));
        console.log("Created Terraform ENV file");
    }
    catch (err) {
        console.log(err);
    }
};
exports.generateEnv = generateEnv;
const init = (deploymentData) => {
    const { state_s3_bucket, region } = deploymentData;
    console.log("Running Terraform init command");
    utils.runSyncTerminalCommand(`cd ./devops/terraform && terraform init -backend-config "bucket=${state_s3_bucket}" -backend-config "region=${region}" -backend-config "key=terraform.tfstate" -reconfigure`);
};
exports.init = init;
const plan = () => {
    console.log("Running Terraform plan command");
    utils.runAsyncTerminalCommand(`cd ./devops/terraform && terraform plan -var-file="terraform.tfvars.json"`);
};
exports.plan = plan;
const apply = () => {
    console.log("Running Terraform apply command");
    utils.runAsyncTerminalCommand(`cd ./devops/terraform && terraform apply -var-file="terraform.tfvars.json" -auto-approve`);
};
exports.apply = apply;
const destroy = (deploymentData) => {
    const { domain_name } = deploymentData;
    console.log("Destroying Front End App");
    utils.runSyncTerminalCommand(`aws s3 rm s3://${domain_name} --recursive`);
    console.log("Running Terraform destroy command");
    utils.runAsyncTerminalCommand(`cd ./devops/terraform && terraform destroy -var-file="terraform.tfvars.json" -auto-approve`);
};
exports.destroy = destroy;
