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
exports.remove = exports.deploy = exports.dev = exports.generateEnv = exports.run = exports.name = void 0;
const utils = __importStar(require("../utils.js"));
const fs_1 = __importDefault(require("fs"));
const internal_ip_1 = __importDefault(require("internal-ip"));
exports.name = "sls";
const run = (command) => {
    if (!fs_1.default.existsSync("./backend/serverless")) {
        throw new Error("A Serverless Framework directory does not exist on your project.");
    }
    if (command === "deploy")
        (0, exports.deploy)();
    else if (command === "remove")
        (0, exports.remove)();
};
exports.run = run;
const prepData = (deploymentData) => {
    const data = utils.initialConfigPrep(deploymentData, exports.name);
    data.api_local_ip_address = internal_ip_1.default.v4.sync();
    data.local_api_rest_port = "4000";
    data.local_api_ws_port = "4500";
    return JSON.stringify(data, null, 2);
};
const generateEnv = (manuallyCreatedSecrets, terraformGeneratedSecrets) => {
    const deploymentData = Object.assign(Object.assign({}, terraformGeneratedSecrets), manuallyCreatedSecrets);
    try {
        fs_1.default.writeFileSync("./backend/serverless/serverless.env.json", prepData(deploymentData));
        console.log("Created SLS ENV file");
    }
    catch (err) {
        console.log(err);
    }
};
exports.generateEnv = generateEnv;
const dev = () => {
    console.log("Running Serverless in dev");
    utils.runAsyncTerminalCommand(`cd ./backend/serverless && npm install && npm run dev`);
};
exports.dev = dev;
const deploy = () => {
    console.log("Deploying Serverless backend");
    utils.runAsyncTerminalCommand(`cd ./backend/serverless && npm install && npm run deploy`);
};
exports.deploy = deploy;
const remove = () => {
    console.log("Removing Serverless in backend");
    utils.runAsyncTerminalCommand(`cd ./backend/serverless && npm install && npm run remove`);
};
exports.remove = remove;
