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
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
describe("utils", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    describe("validate", () => {
        it("should return false if parameter is empty", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = (0, utils_1.validate)("");
            expect(res).toBe(false);
        }));
        it("should return true if parameter is not empty", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = (0, utils_1.validate)("mock");
            expect(res).toBe(true);
        }));
    });
    describe("validateNotJMB", () => {
        it("should return false if parameter is 'jamesmillerblog'", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = (0, utils_1.validateNotJMB)("jamesmillerblog");
            expect(res).toBe(false);
        }));
        it("should return false if parameter is 'jamesmiller.blog'", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = (0, utils_1.validateNotJMB)("jamesmiller.blog");
            expect(res).toBe(false);
        }));
        it("should return true if parameter is empty", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = (0, utils_1.validateNotJMB)("");
            expect(res).toBe(true);
        }));
    });
});
