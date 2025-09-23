import { FakeElement } from "../src/FakeElement";
import { FakeNamespace } from "../src/FakeNamespace";
import { FakeProcessingInstruction } from "../src/FakeProcessingInstruction";
import { FakeContentTypes } from "../src/internal/FakeContentTypes";

describe("FakeProcessingInstruction", () => {
  describe("constructor and getData, getTarget", () => {
    it("should construct an instance and return correct data and target", () => {
      // Act
      const pi = new FakeProcessingInstruction("version='1.0'", "xml");
      // Act & Assert
      expect(pi.getData()).toBe("version='1.0'");
      expect(pi.getTarget()).toBe("xml");
    });
  });

  describe("getValue", () => {
    it("should return data", () => {
      // Arrange
      const pi = new FakeProcessingInstruction("encoding='UTF-8'", "xml");
      // Act & Assert
      expect(pi.getValue()).toBe("encoding='UTF-8'");
    });
  });

  describe("asProcessingInstruction", () => {
    it("should return itself", () => {
      // Arrange
      const pi = new FakeProcessingInstruction("foo", "bar");
      // Act & Assert
      expect(pi.asProcessingInstruction()).toBe(pi);
    });
  });

  describe("getType", () => {
    it("should return PROCESSINGINSTRUCTION", () => {
      // Arrange
      const pi = new FakeProcessingInstruction("foo", "bar");
      // Act & Assert
      expect(pi.getType()).toBe(FakeContentTypes.PROCESSINGINSTRUCTION);
    });
  });

  describe("_clone", () => {
    it("should return a new instance with same data and target", () => {
      // Arrange
      const pi = new FakeProcessingInstruction("data", "target");
      // Act
      const clone = pi._clone();
      // Assert
      expect(clone).not.toBe(pi);
      expect(clone.getData()).toBe("data");
      expect(clone.getTarget()).toBe("target");
      expect(clone.getValue()).toBe("data");
    });
  });

  describe("interface Content", () => {
    it("should work with parent element and set/get data and target correctly", () => {
      // Arrange
      const parent = new FakeElement("root", FakeNamespace.NO_NAMESPACE);
      const pi = new FakeProcessingInstruction("data", "target");
      // Act
      parent.addContent(pi);
      // Act & Assert
      expect(pi.getData()).toBe("data");
      expect(pi.getTarget()).toBe("target");
    });
  });

  describe("toString", () => {
    it("should return a string representation", () => {
      // Arrange
      const pi = new FakeProcessingInstruction("version='1.0'", "xml");
      // Act & Assert
      expect(pi.toString()).toBe(
        "[FakeProcessingInstruction: xml version='1.0']"
      );
    });
  });
});
