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
exports.main = void 0;
const dotenv_1 = require("dotenv");
const frameworks_1 = require("./frameworks");
const scripts_1 = __importDefault(require("./scripts"));
const utils_1 = require("./utils");
(0, dotenv_1.config)();
const main = (argv) => __awaiter(void 0, void 0, void 0, function* () {
    if (argv.length < 3)
        (0, utils_1.error)("Enter a valid gobble command");
    const leadCommand = argv[2];
    const subCommand = argv[3];
    if (leadCommand === "dev") {
        // todo: retire this function and move to templates package.json
        scripts_1.default.dev();
    }
    else if (leadCommand === "finished") {
        yield scripts_1.default.finished(subCommand);
    }
    else if (leadCommand === "duplicate") {
        yield scripts_1.default.duplicate(subCommand, argv[4]);
    }
    else if (leadCommand === "secrets") {
        yield scripts_1.default.secrets(subCommand);
    }
    else if (leadCommand === "terraform" || leadCommand === "tf") {
        // todo: retire this function and move to templates package.json
        frameworks_1.terraform.run(subCommand);
    }
    else if (leadCommand === "serverless" || leadCommand === "sls") {
        // todo: retire this function and move to templates package.json
        frameworks_1.serverless.run(subCommand);
    }
    else if (leadCommand === "eth") {
        // todo: retire this function and move to templates package.json
        frameworks_1.ethereum.run(subCommand);
    }
    else if (leadCommand === "next") {
        // todo: retire this function and move to templates package.json
        frameworks_1.next.run(subCommand);
    }
});
exports.main = main;
