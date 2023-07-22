import { validate, validateNotJMB } from "./utils";

describe("utils", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("validate", () => {
    it("should return false if parameter is empty", async () => {
      const res = validate("");
      expect(res).toBe(false);
    });

    it("should return true if parameter is not empty", async () => {
      const res = validate("mock");
      expect(res).toBe(true);
    });
  });

  describe("validateNotJMB", () => {
    it("should return false if parameter is 'jamesmillerblog'", async () => {
      const res = validateNotJMB("jamesmillerblog");
      expect(res).toBe(false);
    });

    it("should return false if parameter is 'jamesmiller.blog'", async () => {
      const res = validateNotJMB("jamesmiller.blog");
      expect(res).toBe(false);
    });

    it("should return true if parameter is empty", async () => {
      const res = validateNotJMB("");
      expect(res).toBe(true);
    });
  });
});
