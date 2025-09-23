import { FakeElement } from "../src/FakeElement";
import { FakeEntityRef } from "../src/FakeEntityRef";
import { FakeNamespace } from "../src/FakeNamespace";
import { FakeContentTypes } from "../src/internal/FakeContentTypes";

describe("FakeEntityRef", () => {
  describe("constructor", () => {
    it("should create an instance", () => {
      // Act
      const ref = new FakeEntityRef();
      // Assert
      expect(ref).toBeInstanceOf(FakeEntityRef);
    });
  });

  describe("getName", () => {
    it("should return empty string for getName", () => {
      // Arrange
      const ref = new FakeEntityRef();
      // Act & Assert
      expect(ref.getName()).toBe("");
    });
  });

  describe("setName", () => {
    it("should return itself for setName", () => {
      // Arrange
      const ref = new FakeEntityRef();
      // Act & Assert
      expect(ref.setName("foo")).toBe(ref);
    });
  });

  describe("getPublicId and getSystemId", () => {
    it("should return null for getPublicId and getSystemId", () => {
      // Arrange
      const ref = new FakeEntityRef();
      // Act & Assert
      expect(ref.getPublicId()).toBeNull();
      expect(ref.getSystemId()).toBeNull();
    });
  });

  describe("setPublicId and setSystemId", () => {
    it("should return itself for setPublicId and setSystemId", () => {
      // Arrange
      const ref = new FakeEntityRef();
      // Act & Assert
      expect(ref.setPublicId("id")).toBe(ref);
      expect(ref.setSystemId("id")).toBe(ref);
    });
  });

  describe("asEntityRef", () => {
    it("should return itself for asEntityRef", () => {
      // Arrange
      const ref = new FakeEntityRef();
      // Act & Assert
      expect(ref.asEntityRef()).toBe(ref);
    });
  });

  describe("getType", () => {
    it("should return correct type", () => {
      // Arrange
      const ref = new FakeEntityRef();
      // Act & Assert
      expect(ref.getType()).toBe(FakeContentTypes.ENTITYREF);
    });
  });

  describe("getValue", () => {
    it("should return empty string for getValue", () => {
      // Arrange
      const ref = new FakeEntityRef();
      // Act & Assert
      expect(ref.getValue()).toBe("");
    });
  });

  describe("_clone", () => {
    it("should clone itself", () => {
      // Arrange
      const ref = new FakeEntityRef();
      // Act
      const clone = ref._clone();
      // Assert
      expect(clone).toBeInstanceOf(FakeEntityRef);
      expect(clone).not.toBe(ref);
    });
  });

  describe("interface Content", () => {
    it("should accept parent element", () => {
      // Arrange
      const parent = new FakeElement("foo", FakeNamespace.NO_NAMESPACE);
      const ref = new FakeEntityRef();
      // Act
      parent.addContent(ref);
      // Act & Assert
      expect(ref._getParent()).toBe(parent);
    });
  });

  describe("toString", () => {
    it("should return a string representation", () => {
      // Arrange
      const ref = new FakeEntityRef();
      // Act & Assert
      expect(ref.toString()).toBe("[FakeEntityRef]");
    });
  });
});
