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
exports.configureTemplate = exports.cliGenerateSecretsPrompt = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const templates_1 = require("../templates");
const utils_1 = require("../utils");
const cliGenerateSecretsPrompt = () => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = {
        type: "list",
        name: "secrets",
        message: "Would you like Wrapper.js to create a Secret in AWS Secrets Manager for you?",
        choices: [
            "Yes - choose this if you are not sure.",
            "No - I will manually create my own AWS Secret based on the documentation noted on https://jamesmiller.blog/wrapperjs.",
        ],
    };
    const { secrets } = yield inquirer_1.default.prompt(prompt);
    return String(secrets);
});
exports.cliGenerateSecretsPrompt = cliGenerateSecretsPrompt;
const configureTemplate = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const secretsChoice = yield (0, exports.cliGenerateSecretsPrompt)();
    const secretsRequired = secretsChoice.includes("Yes");
    const name = options.template;
    const t = retrieveTemplate(name);
    const template = new t(secretsRequired);
    if (secretsRequired)
        template.setupConfig();
    return template;
});
exports.configureTemplate = configureTemplate;
const retrieveTemplate = (name) => {
    for (const template of Object.values(templates_1.templates)) {
        console.log("HIA");
        console.log(name);
        console.log(template.templateName);
        if (name === template.templateName)
            return template;
    }
    (0, utils_1.error)(`Template ${name} does not exist`);
};
