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
exports.selectTemplate = void 0;
const arg_1 = __importDefault(require("arg"));
const inquirer_1 = __importDefault(require("inquirer"));
const selectTemplate = (args) => __awaiter(void 0, void 0, void 0, function* () {
    welcomeMessage();
    const options = yield parseArgumentsIntoOptions(args);
    const template = yield templateQuestion(options);
    return Object.assign(Object.assign({}, options), { template });
});
exports.selectTemplate = selectTemplate;
const welcomeMessage = () => {
    console.log("Thank you for using\n");
    console.log(`
    ██╗    ██╗██████╗  █████╗ ██████╗ ██████╗ ███████╗██████╗         ██╗███████╗
    ██║    ██║██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔══██╗        ██║██╔════╝
    ██║ █╗ ██║██████╔╝███████║██████╔╝██████╔╝█████╗  ██████╔╝        ██║███████╗
    ██║███╗██║██╔══██╗██╔══██║██╔═══╝ ██╔═══╝ ██╔══╝  ██╔══██╗   ██   ██║╚════██║
    ╚███╔███╔╝██║  ██║██║  ██║██║     ██║     ███████╗██║  ██║██╗╚█████╔╝███████║
     ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝ ╚════╝ ╚══════╝
                                                                                 `);
    console.log("\nYou will now be asked questions on your wrapper configuration:\n");
};
const parseArgumentsIntoOptions = (rawArgs) => __awaiter(void 0, void 0, void 0, function* () {
    const args = (0, arg_1.default)({
        "--yes": Boolean,
        "--install": Boolean,
        "-y": "--yes",
        "-i": "--install",
    }, {
        argv: rawArgs.slice(2),
    });
    return {
        template: args._[0],
        runInstall: args["--install"] || false,
    };
});
const templateQuestion = (options, defaultTemplate = "WebXR") => __awaiter(void 0, void 0, void 0, function* () {
    const choices = ["WebXR", "Auth", "Eth-Auth", "Eth-Metaverse"];
    const prompt = {
        type: "list",
        name: "template",
        message: "Please choose which project template to use",
        choices,
        default: defaultTemplate,
    };
    if (choices.includes(options.template))
        return options.template;
    const { template } = yield inquirer_1.default.prompt(prompt);
    return String(template);
});
