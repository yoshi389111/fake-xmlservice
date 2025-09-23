import { AbstractFakeContent } from "../src/AbstractFakeContent";
import { FakeDocument } from "../src/FakeDocument";
import { FakeElement } from "../src/FakeElement";
import { FakeNamespace } from "../src/FakeNamespace";
import { FakeContentTypes } from "../src/internal/FakeContentTypes";

const NO_NAMESPACE = FakeNamespace.NO_NAMESPACE;

class DummyContent extends AbstractFakeContent {
  getType() {
    return FakeContentTypes.TEXT;
  }
  getValue() {
    return "dummy";
  }
  _clone() {
    return new DummyContent();
  }
}

describe("AbstractFakeContent", () => {
  describe("asXxx methods", () => {
    it("should return null for asXxx methods", () => {
      // Arrange
      const dummy = new DummyContent();
      // Act & Assert
      expect(dummy.asCdata()).toBeNull();
      expect(dummy.asComment()).toBeNull();
      expect(dummy.asDocType()).toBeNull();
      expect(dummy.asElement()).toBeNull();
      expect(dummy.asEntityRef()).toBeNull();
      expect(dummy.asProcessingInstruction()).toBeNull();
      expect(dummy.asText()).toBeNull();
    });
  });

  describe("detach", () => {
    it("should detach from parent", () => {
      // Arrange
      const parent = new FakeElement("el", NO_NAMESPACE);
      const dummy = new DummyContent();
      parent.addContent(dummy);
      expect(dummy._getParent()).toBe(parent);
      // Act
      dummy.detach();
      // Assert
      expect(dummy._getParent()).toBeNull();
      expect(parent.getContentSize()).toBe(0);
    });

    it("should do nothing if not attached", () => {
      // Arrange
      const dummy = new DummyContent();
      expect(dummy._getParent()).toBeNull();
      // Act
      dummy.detach();
      // Assert
      expect(dummy._getParent()).toBeNull();
    });
  });

  describe("getParentElement", () => {
    it("should get parent element", () => {
      // Arrange
      const parent = new FakeElement("el", NO_NAMESPACE);
      const dummy = new DummyContent();
      parent.addContent(dummy);
      // Act & Assert
      expect(dummy.getParentElement()).toBe(parent);
    });

    it("should get null for parent element if parent is document", () => {
      // Arrange
      const doc = new FakeDocument();
      const dummy = new DummyContent();
      dummy._setParent(doc);
      // Act & Assert
      expect(dummy.getParentElement()).toBeNull();
    });

    it("should get null for parent element if not attached", () => {
      // Arrange
      const dummy = new DummyContent();
      // Act & Assert
      expect(dummy.getParentElement()).toBeNull();
    });
  });

  describe("_getParent and _setParent", () => {
    it("should _getParent and _setParent work", () => {
      // Arrange
      const parent = new FakeElement("el", NO_NAMESPACE);
      const dummy = new DummyContent();
      // Act & Assert
      expect(dummy._getParent()).toBeNull();
      dummy._setParent(parent);
      expect(dummy._getParent()).toBe(parent);
      dummy._setParent(null);
      expect(dummy._getParent()).toBeNull();
    });
  });
});
