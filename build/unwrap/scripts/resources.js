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
exports.shouldGenerateResources = exports.createS3Bucket = exports.createSecrets = void 0;
/* eslint-disable camelcase */
const node_cmd_1 = __importDefault(require("node-cmd"));
const utils_1 = require("../utils");
const createSecrets = (template) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const configuration_name = (_a = template.config) === null || _a === void 0 ? void 0 : _a.configuration_name;
    if (!template.config || !configuration_name) {
        (0, utils_1.error)("Config needed to create secrets");
    }
    const stringifiedJson = JSON.stringify(JSON.stringify(template.secrets));
    const cmdString = `aws secretsmanager create-secret --name ${configuration_name} --secret-string ${stringifiedJson}`;
    const command = node_cmd_1.default.runSync(cmdString);
    if (command.err)
        (0, utils_1.error)(`Sync Err ${command.err}`);
    else if (command.stderr)
        (0, utils_1.error)(`Sync stdrr ${command.stderr}`);
});
exports.createSecrets = createSecrets;
const createS3Bucket = (template) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const s3_bucket = (_b = template.config) === null || _b === void 0 ? void 0 : _b.s3_bucket;
    const region = (_c = template.config) === null || _c === void 0 ? void 0 : _c.region;
    if (!s3_bucket || !region)
        (0, utils_1.error)("Config needed to create S3 Bucket");
    const cmdStr = `aws s3api create-bucket --bucket ${s3_bucket} --region ${region} --create-bucket-configuration LocationConstraint=${region}`;
    const command = node_cmd_1.default.runSync(cmdStr);
    if (command.err)
        (0, utils_1.error)(`Sync Err ${command.err}`);
    else if (command.stderr)
        (0, utils_1.error)(`Sync stderr: ${command.stderr}`);
});
exports.createS3Bucket = createS3Bucket;
const shouldGenerateResources = ({ secretsRequired, }) => secretsRequired;
exports.shouldGenerateResources = shouldGenerateResources;
