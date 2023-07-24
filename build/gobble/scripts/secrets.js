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
const fs_1 = require("fs");
const config_1 = __importDefault(require("../config"));
const utils = __importStar(require("../utils"));
const frameworks_1 = require("../frameworks");
exports.default = (secret) => __awaiter(void 0, void 0, void 0, function* () {
    const manuallyCreatedSecretsExist = yield utils.secretExists(secret);
    if (!manuallyCreatedSecretsExist) {
        utils.error(`secret ${secret} does not exist`);
    }
    try {
        const secrets = yield utils.getSecrets(secret);
        frameworks_1.terraform.generateEnv(secrets);
        const serviceName = secrets.tf_sls_service_name
            ? secrets.tf_sls_service_name
            : secrets.eth_tf_sls_service_name;
        const tfCreatedSecretsExist = yield utils.secretExists(`${serviceName}-tf`);
        if (serviceName && !!tfCreatedSecretsExist) {
            const tfSecrets = yield utils.getSecrets(`${serviceName}-tf`);
            config_1.default.forEach((c) => {
                if ((0, fs_1.existsSync)(c.filepath))
                    c.cli.generateEnv(secrets, tfSecrets);
            });
        }
        else {
            console.log("Congrats, Terraform files have been generated!\n");
            console.log("Next step, run Terraform commands to create AWS resources.");
            console.log("Once you've created your Terraform resources, rerun this command to generate secrets that can be used for the Back End and Front End.");
        }
    }
    catch (e) {
        utils.error(JSON.stringify(e));
    }
});
