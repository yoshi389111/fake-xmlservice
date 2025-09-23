import { FakeComment } from "../src/FakeComment";
import { FakeElement } from "../src/FakeElement";
import { FakeNamespace } from "../src/FakeNamespace";
import { FakeContentTypes } from "../src/internal/FakeContentTypes";

describe("FakeComment", () => {
  describe("constructor and getText, setText", () => {
    it("should create instance and get/set text", () => {
      // Act
      const comment = new FakeComment("hello");
      // Act & Assert
      expect(comment.getText()).toBe("hello");
      // Act
      comment.setText("world");
      // Act & Assert
      expect(comment.getText()).toBe("world");
    });
  });

  describe("getValue", () => {
    it("should return comment text", () => {
      // Arrange
      const comment = new FakeComment("foo");
      // Act & Assert
      expect(comment.getValue()).toBe("foo");
    });
  });

  describe("asComment", () => {
    it("should return itself", () => {
      // Arrange
      const comment = new FakeComment("bar");
      // Act & Assert
      expect(comment.asComment()).toBe(comment);
    });
  });

  describe("getType", () => {
    it("should return FakeContentTypes.COMMENT", () => {
      // Arrange
      const comment = new FakeComment("baz");
      // Act & Assert
      expect(comment.getType()).toBe(FakeContentTypes.COMMENT);
    });
  });

  describe("_clone", () => {
    it("should return new instance with same text", () => {
      // Arrange
      const comment = new FakeComment("abc");
      // Act
      const clone = comment._clone();
      // Assert
      expect(clone).not.toBe(comment);
      expect(clone.getText()).toBe("abc");
      expect(clone._getParent()).toBeNull();
    });
  });

  describe("interface Content", () => {
    it("should accept parent element", () => {
      // Arrange
      const parent = new FakeElement("foo", FakeNamespace.NO_NAMESPACE);
      const comment = new FakeComment("bar");
      // Act & Assert
      parent.addContent(comment);
      expect(comment._getParent()).toBe(parent);
    });
  });

  describe("toString", () => {
    it("should return a string representation", () => {
      // Arrange
      const comment = new FakeComment("abc");
      // Act & Assert
      expect(comment.toString()).toBe("[FakeComment: abc]");
    });
  });
});
