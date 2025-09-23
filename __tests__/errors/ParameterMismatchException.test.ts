import { ParameterMismatchException } from "../../src/errors/ParameterMismatchException";

describe("ParameterMismatchException", () => {
  describe("constructor", () => {
    it("should create an exception with correct name and message for primitives", () => {
      // Act
      const e = new ParameterMismatchException("MyClass.myMethod", [
        1,
        "abc",
        true,
      ]);
      // Assert
      expect(e.name).toBe("Exception");
      expect(e.message).toBe(
        "The parameters (number,string,boolean) don't match the method signature for MyClass.myMethod"
      );
    });

    it("should create an exception with correct message for null and undefined", () => {
      // Act
      const e = new ParameterMismatchException("MyClass.myMethod", [
        null,
        undefined,
      ]);
      // Assert
      expect(e.message).toBe(
        "The parameters (null,undefined) don't match the method signature for MyClass.myMethod"
      );
    });

    it("should create an exception with correct message for arrays and objects", () => {
      // Act
      const e = new ParameterMismatchException("MyClass.myMethod", [
        [1, 2],
        { foo: "bar" },
      ]);
      // Assert
      expect(e.message).toBe(
        "The parameters (Array,Object) don't match the method signature for MyClass.myMethod"
      );
    });

    it("should create an exception with correct message for class instances", () => {
      // Arrange
      class Dummy {}
      // Act
      const e = new ParameterMismatchException("MyClass.myMethod", [
        new Dummy(),
        Dummy,
      ]);
      // Assert
      expect(e.message).toBe(
        "The parameters (Dummy,class) don't match the method signature for MyClass.myMethod"
      );
    });

    it("should create an exception with correct message for function, symbol and class", () => {
      // Arrange
      const sym = Symbol("s");
      // Act
      const e = new ParameterMismatchException("MyClass.myMethod", [
        () => {},
        sym,
      ]);
      // Assert
      expect(e.message).toBe(
        "The parameters (Function,symbol) don't match the method signature for MyClass.myMethod"
      );
    });

    it("should use Symbol.toStringTag if present", () => {
      // Arrange
      const obj = { [Symbol.toStringTag]: "SpecialTag" };
      const obj2 = { [Symbol.toStringTag]: "" };
      // Act
      const e = new ParameterMismatchException("MyClass.myMethod", [obj, obj2]);
      // Assert
      expect(e.message).toBe(
        "The parameters (SpecialTag,Object) don't match the method signature for MyClass.myMethod"
      );
    });

    it("should create an exception with broken constructor", () => {
      // Arrange
      const broken = Object.create(null);
      // Act
      const e = new ParameterMismatchException("MyClass.myMethod", [broken]);
      // Assert
      expect(e.message).toBe(
        "The parameters (object) don't match the method signature for MyClass.myMethod"
      );
    });
  });
});
