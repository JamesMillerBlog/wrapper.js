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
exports.deploy = exports.dev = exports.generateEnv = exports.run = exports.name = void 0;
const utils = __importStar(require("../utils"));
const fs_1 = __importDefault(require("fs"));
const internal_ip_1 = __importDefault(require("internal-ip"));
exports.name = "eth";
const run = (command) => {
    if (!fs_1.default.existsSync("./backend/ethereum")) {
        utils.error("An Ethereum directory does not exist on your project.");
    }
    if (command === "deploy") {
        const envVarsLocation = "backend/ethereum/eth.env.json";
        const envVars = JSON.parse(fs_1.default.readFileSync(envVarsLocation, "utf8"));
        (0, exports.deploy)(envVars);
    }
};
exports.run = run;
const prepData = (deploymentData) => {
    const data = {};
    for (const property in deploymentData) {
        if (property.includes(exports.name)) {
            const newKey = property.replace(/eth_/gi, "");
            data[newKey] = deploymentData[property];
        }
    }
    data.local_ip_address = internal_ip_1.default.v4.sync();
    data.localhost_network_id = "5777";
    return JSON.stringify(data, null, 2);
};
const generateEnv = (manuallyCreatedSecrets, terraformGeneratedSecrets) => {
    const deploymentData = Object.assign(Object.assign({}, terraformGeneratedSecrets), manuallyCreatedSecrets);
    const rawEthData = prepData(deploymentData);
    try {
        fs_1.default.writeFileSync("./backend/ethereum/eth.env.json", rawEthData);
        console.log("Created ETH ENV file");
    }
    catch (err) {
        if (!String(err).includes("no such file or directory")) {
            console.log(err);
        }
    }
};
exports.generateEnv = generateEnv;
const dev = () => {
    console.log("Running Eth in dev");
    utils.runAsyncTerminalCommand(`cd backend/ethereum && npm install && npx hardhat node --hostname 0.0.0.0`);
    utils.runAsyncTerminalCommand(`cd backend/ethereum && npm install && npx hardhat compile && npx hardhat run scripts/deploy.js --network localhost`);
};
exports.dev = dev;
const deploy = (envVars) => {
    utils.runAsyncTerminalCommand(`cd backend/ethereum && npx hardhat compile && npx hardhat run scripts/deploy.js --network ${envVars.network}`);
};
exports.deploy = deploy;
