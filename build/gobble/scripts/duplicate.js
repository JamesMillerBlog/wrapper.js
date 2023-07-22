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
Object.defineProperty(exports, "__esModule", { value: true });
const utils = __importStar(require("../utils"));
exports.default = (secret, duplicate = undefined) => __awaiter(void 0, void 0, void 0, function* () {
    if (secret === undefined)
        utils.error(`Provide a secret to duplicate.`);
    const secretExists = yield utils.secretExists(secret);
    if (!secretExists)
        utils.error(`secret ${secret} does not exist`);
    const secrets = yield utils.getSecrets(secret);
    const env = duplicate && parseInt(duplicate) ? "pr-" : "";
    secrets.tf_sls_next_stage = `${env}${duplicate}`;
    secrets.tf_sls_next_domain_name = `${env}${duplicate}.${secrets.tf_sls_next_root_domain_name}`;
    secrets.tf_state_s3_bucket = `${env}${duplicate}-${secrets.tf_state_s3_bucket}`;
    const duplicateSecret = `${env}${duplicate}-${secret}`;
    const stringifiedSecrets = JSON.stringify(JSON.stringify(secrets));
    const duplicateSecretCommand = `aws secretsmanager create-secret --name ${duplicateSecret} --secret-string ${stringifiedSecrets}`;
    utils.runSyncTerminalCommand(duplicateSecretCommand);
    const duplicatedSecretExists = yield utils.secretExists(`${duplicateSecret}`);
    if (!duplicatedSecretExists) {
        utils.error(`new secret ${duplicateSecret} not created`);
    }
    else {
        console.log(`secret ${duplicateSecret} has been created`);
    }
    const duplicateS3Command = `aws s3api create-bucket --bucket ${secrets.tf_state_s3_bucket} --region ${secrets.tf_sls_next_region} --create-bucket-configuration LocationConstraint=${secrets.tf_sls_next_region}`;
    utils.runSyncTerminalCommand(duplicateS3Command);
});
