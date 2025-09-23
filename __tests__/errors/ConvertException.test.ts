import { ConvertException } from "../../src/errors/ConvertException";

describe("ConvertException", () => {
  describe("constructor", () => {
    it("should set the name property to Exception", () => {
      // Act
      const e = new ConvertException("detail", undefined);
      // Assert
      expect(e.name).toBe("Exception");
    });

    it("should format the message with detail", () => {
      // Act
      const e = new ConvertException("something went wrong", undefined);
      // Assert
      expect(e.message).toBe("convert failed: something went wrong");
    });

    it("should include the cause if provided", () => {
      // Arrange
      const cause = new Error("root cause");
      // Act
      const e = new ConvertException("fail", cause);
      // Assert
      expect(e.cause).toBe(cause);
    });

    it("should be an instance of Error", () => {
      // Act
      const e = new ConvertException("x", undefined);
      // Assert
      expect(e instanceof Error).toBe(true);
    });
  });
});
