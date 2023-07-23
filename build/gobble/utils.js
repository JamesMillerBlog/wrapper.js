"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.secretExists = exports.getSecrets = exports.initialConfigPrep = exports.runAsyncTerminalCommand = exports.runSyncTerminalCommand = void 0;
const node_cmd_1 = __importDefault(require("node-cmd"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const chalk_1 = __importDefault(require("chalk"));
process.env.AWS_SDK_LOAD_CONFIG = "1";
const runSyncTerminalCommand = (terminalCommand) => {
    const command = node_cmd_1.default.runSync(terminalCommand);
    console.log("Started running a command");
    console.log(terminalCommand);
    if (command.err)
        (0, exports.error)(`Sync Err ${command.err}`);
};
exports.runSyncTerminalCommand = runSyncTerminalCommand;
const runAsyncTerminalCommand = (terminalCommand) => __awaiter(void 0, void 0, void 0, function* () {
    const command = node_cmd_1.default.run(terminalCommand, function (err) {
        console.log("Started running a command");
        if (err)
            (0, exports.error)(`${err}`);
    });
    command.stdout.on("data", function (data) {
        if (data)
            console.log(data);
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    command.stdout.on("close", function (_data) {
        console.log("Finished running command");
    });
});
exports.runAsyncTerminalCommand = runAsyncTerminalCommand;
const initialConfigPrep = (deploymentData, framework) => {
    const data = {};
    for (const property in deploymentData) {
        if (property.includes(framework)) {
            const newKey = property.replace(/tf_|sls_|eth_|next_/gi, "");
            data[newKey] = deploymentData[property];
        }
    }
    return data;
};
exports.initialConfigPrep = initialConfigPrep;
const getSecrets = (secretName) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new aws_sdk_1.default.SecretsManager();
    try {
        const data = yield client
            .getSecretValue({
            SecretId: secretName,
        })
            .promise();
        if (data) {
            if (data.SecretString)
                return JSON.parse(data.SecretString);
            return data.SecretBinary;
        }
    }
    catch (err) {
        throw new Error(String(err));
    }
});
exports.getSecrets = getSecrets;
const secretExists = (secretName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, exports.getSecrets)(secretName);
        return true;
    }
    catch (e) {
        return false;
    }
});
exports.secretExists = secretExists;
const error = (message) => {
    console.error(message, chalk_1.default.red.bold("ERROR"));
    process.exit(1);
};
exports.error = error;
