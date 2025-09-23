import { InvalidArgumentException } from "../../src/errors/InvalidArgumentException";

describe("InvalidArgumentException", () => {
  describe("constructor", () => {
    it("should set the name property to Exception", () => {
      // Act
      const e = new InvalidArgumentException("foo", "bar");
      // Assert
      expect(e.name).toBe("Exception");
    });

    it("should format the message with argument name and detail", () => {
      // Act
      const e = new InvalidArgumentException("param", "must be a string");
      // Assert
      expect(e.message).toBe("invalid argument: param - must be a string");
    });

    it("should include argument name and message in the error message", () => {
      // Act
      const e = new InvalidArgumentException("value", "invalid value");
      // Assert
      expect(e.message).toContain("invalid argument: value - invalid value");
    });

    it("should be an instance of Error", () => {
      // Act
      const e = new InvalidArgumentException("x", "y");
      // Assert
      expect(e instanceof Error).toBe(true);
    });
  });
});
