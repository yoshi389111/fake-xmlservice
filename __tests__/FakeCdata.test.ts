import { FakeCdata } from "../src/FakeCdata";
import { FakeElement } from "../src/FakeElement";
import { FakeNamespace } from "../src/FakeNamespace";
import { FakeContentTypes } from "../src/internal/FakeContentTypes";

describe("FakeCdata", () => {
  describe("constructor and getText, setText", () => {
    it("should create an instance and allow getting and setting text", () => {
      // Act
      const cdata = new FakeCdata("abc");
      // Act & Assert
      expect(cdata.getText()).toBe("abc");

      // Act
      cdata.setText("xyz");
      // Act & Assert
      expect(cdata.getText()).toBe("xyz");
    });
  });

  describe("asCdata", () => {
    it("should return itself", () => {
      // Arrange
      const cdata = new FakeCdata("abc");
      // Act & Assert
      expect(cdata.asCdata()).toBe(cdata);
    });
  });

  describe("getType", () => {
    it("should return the CDATA type", () => {
      // Arrange
      const cdata = new FakeCdata("abc");
      // Act & Assert
      expect(cdata.getType()).toBe(FakeContentTypes.CDATA);
    });
  });

  describe("_clone", () => {
    it("should create a new instance with the same text and no parent", () => {
      // Arrange
      const cdata = new FakeCdata("abc");
      // Act
      const clone = cdata._clone();
      // Assert
      expect(clone).not.toBe(cdata);
      expect(clone.getText()).toBe("abc");
      expect(clone._getParent()).toBeNull();
    });
  });

  describe("interface Content", () => {
    it("should set the parent element correctly when added to a parent", () => {
      // Arrange
      const parent = new FakeElement("foo", FakeNamespace.NO_NAMESPACE);
      const cdata = new FakeCdata("bar");
      // Act & Assert
      parent.addContent(cdata);
      expect(cdata._getParent()).toBe(parent);
    });
  });

  describe("toString", () => {
    it("should return a string representation", () => {
      // Arrange
      const cdata = new FakeCdata("abc");
      // Act & Assert
      expect(cdata.toString()).toBe("[FakeCdata: abc]");
    });
  });
});
