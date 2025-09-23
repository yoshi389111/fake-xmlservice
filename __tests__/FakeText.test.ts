import { FakeElement } from "../src/FakeElement";
import { FakeNamespace } from "../src/FakeNamespace";
import { FakeText } from "../src/FakeText";
import { FakeContentTypes } from "../src/internal/FakeContentTypes";

const NO_NAMESPACE = FakeNamespace.NO_NAMESPACE;

describe("FakeText", () => {
  describe("constructor and getText/setText", () => {
    it("should create text", () => {
      // Act
      const text = new FakeText("hello");
      // Assert
      expect(text.getText()).toBe("hello");
    });
  });

  describe("getText", () => {
    it("should get text", () => {
      // Arrange
      const text = new FakeText("hello");
      // Act & Assert
      expect(text.getText()).toBe("hello");

      // Arrange
      text.setText("world");
      // Act & Assert
      expect(text.getText()).toBe("world");
    });
  });

  describe("setText", () => {
    it("should set text", () => {
      // Arrange
      const text = new FakeText("hello");
      expect(text.getText()).toBe("hello");
      // Act
      text.setText("world");
      // Assert
      expect(text.getText()).toBe("world");
    });
  });

  describe("append", () => {
    it("should append text", () => {
      // Arrange
      const text = new FakeText("foo");
      // Act
      text.append("bar");
      // Assert
      expect(text.getText()).toBe("foobar");
    });
  });

  describe("asText", () => {
    it("should return itself from asText", () => {
      // Arrange
      const text = new FakeText("abc");
      // Act & Assert
      expect(text.asText()).toBe(text);
    });
  });

  describe("getType", () => {
    it("should get type TEXT", () => {
      // Arrange
      const text = new FakeText("abc");
      // Act & Assert
      expect(text.getType()).toBe(FakeContentTypes.TEXT);
    });
  });

  describe("getValue", () => {
    it("should get value", () => {
      // Arrange
      const text = new FakeText("xyz");
      // Act & Assert
      expect(text.getValue()).toBe("xyz");
    });
  });

  describe("_clone", () => {
    it("should clone itself", () => {
      // Arrange
      const text = new FakeText("clone");
      // Act
      const clone = text._clone();
      // Assert
      expect(clone).not.toBe(text);
      expect(clone.getText()).toBe(text.getText());
    });
  });

  describe("interface Content", () => {
    it("should set parent element", () => {
      // Arrange
      const parent = new FakeElement("el", NO_NAMESPACE);
      const text = new FakeText("abc");
      // Act
      text._setParent(parent);
      // Act & Assert
      expect(text.getParentElement()).toBe(parent);
    });
  });

  describe("toString", () => {
    it("should return a string representation", () => {
      // Arrange
      const text = new FakeText("abc");
      // Act & Assert
      expect(text.toString()).toBe("[FakeText: abc]");
    });
  });
});
