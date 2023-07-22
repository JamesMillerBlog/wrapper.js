"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const frameworks_1 = require("./frameworks");
exports.default = [
    {
        filepath: "./frontend",
        cli: frameworks_1.next,
    },
    {
        filepath: "./backend/serverless",
        cli: frameworks_1.serverless,
    },
    {
        filepath: "./backend/ethereum",
        cli: frameworks_1.ethereum,
    },
];
