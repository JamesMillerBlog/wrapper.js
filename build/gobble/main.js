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
exports.main = exports.LeadCommand = void 0;
const dotenv_1 = require("dotenv");
const frameworks_1 = require("./frameworks");
const scripts_1 = __importDefault(require("./scripts"));
const utils_1 = require("./utils");
(0, dotenv_1.config)();
var LeadCommand;
(function (LeadCommand) {
    LeadCommand["DEV"] = "dev";
    LeadCommand["FINISHED"] = "finished";
    LeadCommand["DUPLICATE"] = "duplicate";
    LeadCommand["SECRETS"] = "secrets";
    LeadCommand["TERRAFORM"] = "terraform";
    LeadCommand["TF"] = "tf";
    LeadCommand["SERVERLESS"] = "serverless";
    LeadCommand["SLS"] = "sls";
    LeadCommand["ETH"] = "eth";
    LeadCommand["NEXT"] = "next";
})(LeadCommand || (exports.LeadCommand = LeadCommand = {}));
const main = (argv) => __awaiter(void 0, void 0, void 0, function* () {
    if (argv.length < 2)
        (0, utils_1.error)("Enter a valid gobble command");
    const leadCommand = argv[2];
    const subCommand = argv[3];
    switch (leadCommand) {
        case LeadCommand.DEV:
            scripts_1.default.dev(); // todo: retire this function and move to templates package.json
            break;
        case LeadCommand.FINISHED:
            if (argv.length < 3)
                (0, utils_1.error)("Enter a valid wrapperjs config to destroy");
            yield scripts_1.default.finished(subCommand);
            break;
        case LeadCommand.DUPLICATE:
            if (argv.length < 3)
                (0, utils_1.error)("Enter a valid wrapperjs config to duplicate");
            yield scripts_1.default.duplicate(subCommand, argv[4]);
            break;
        case LeadCommand.SECRETS:
            if (argv.length < 3)
                (0, utils_1.error)("Enter valid wrapperjs secrets to retrieve");
            yield scripts_1.default.secrets(subCommand);
            break;
        case LeadCommand.TERRAFORM:
        case LeadCommand.TF:
            if (argv.length < 3)
                (0, utils_1.error)("Enter valid terraform command");
            frameworks_1.terraform.run(subCommand);
            break;
        case LeadCommand.SERVERLESS:
        case LeadCommand.SLS:
            if (argv.length < 3)
                (0, utils_1.error)("Enter valid serverless command");
            frameworks_1.serverless.run(subCommand); // todo: retire this function and move to templates package.json
            break;
        case LeadCommand.ETH:
            if (argv.length < 3)
                (0, utils_1.error)("Enter valid ethereum command");
            frameworks_1.ethereum.run(subCommand); // todo: retire this function and move to templates package.json
            break;
        case LeadCommand.NEXT:
            if (argv.length < 3)
                (0, utils_1.error)("Enter valid next command");
            frameworks_1.next.run(subCommand); // todo: retire this function and move to templates package.json
            break;
        default:
            (0, utils_1.error)("Command not recognised, please try again");
    }
});
exports.main = main;
