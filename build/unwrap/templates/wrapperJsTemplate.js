"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseTemplate = void 0;
class BaseTemplate {
    constructor(name, createSecrets, requestConfiguration) {
        this.name = name;
        this.createSecrets = createSecrets;
        this.requestConfiguration = requestConfiguration;
    }
}
exports.BaseTemplate = BaseTemplate;
