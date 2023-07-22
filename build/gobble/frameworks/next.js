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
exports.buildAndDeploy = exports.dev = exports.generateEnv = exports.run = exports.name = void 0;
/* eslint-disable camelcase */
const utils = __importStar(require("../utils.js"));
const fs_1 = __importDefault(require("fs"));
const internal_ip_1 = __importDefault(require("internal-ip"));
exports.name = "next";
const run = (command) => {
    if (!fs_1.default.existsSync("./frontend")) {
        throw new Error("A Front End directory for NextJS does not exist on your project.");
    }
    if (command === "export") {
        const envVars = JSON.parse(fs_1.default.readFileSync("devops/terraform/terraform.tfvars.json", "utf8"));
        (0, exports.buildAndDeploy)(envVars);
    }
};
exports.run = run;
const prepData = (deploymentData) => {
    const data = utils.initialConfigPrep(deploymentData, exports.name);
    data.api_local_ip_address = internal_ip_1.default.v4.sync();
    data.local_api_rest_port = "4000";
    data.local_api_ws_port = "4500";
    return `module.exports = {trailingSlash: true,env: ${JSON.stringify(data, null, 2)}};`;
};
const generateEnv = (manuallyCreatedSecrets, terraformGeneratedSecrets) => {
    const deploymentData = Object.assign(Object.assign({}, terraformGeneratedSecrets), manuallyCreatedSecrets);
    try {
        fs_1.default.writeFileSync("./frontend/next.config.js", prepData(deploymentData));
        console.log("Created NextJS ENV file");
    }
    catch (err) {
        console.log(err);
    }
};
exports.generateEnv = generateEnv;
const dev = () => {
    console.log("Running Next.JS in dev");
    utils.runAsyncTerminalCommand(`cd ./frontend && npm install && npm run dev`);
};
exports.dev = dev;
const buildAndDeploy = ({ domain_name }) => {
    console.log("Exporting and deploying Next.JS");
    utils.runSyncTerminalCommand(`cd frontend && npm install && npm run build`);
    utils.runSyncTerminalCommand(`aws s3 rm --recursive s3://${domain_name}`);
    utils.runAsyncTerminalCommand(`aws s3 sync ./frontend/out s3://${domain_name}`);
};
exports.buildAndDeploy = buildAndDeploy;
