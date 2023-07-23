"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.validateNotJMB = exports.validate = void 0;
const chalk_1 = __importDefault(require("chalk"));
const validate = (input) => {
    if (input === "") {
        console.log("You need to enter a valid answer");
        return false;
    }
    return true;
};
exports.validate = validate;
const validateNotJMB = (input) => {
    if (input.includes("jamesmiller.blog") || input.includes("jamesmillerblog")) {
        console.log(`You can't use the example of ${input}, this was just to help you understand how to enter your own configuration`);
        return false;
    }
    return true;
};
exports.validateNotJMB = validateNotJMB;
const error = (message) => {
    console.error(message, chalk_1.default.red.bold("ERROR"));
    process.exit(1);
};
exports.error = error;
