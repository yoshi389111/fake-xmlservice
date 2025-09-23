import { NamespaceHelper } from "../../src/internal/NamespaceHelper";
import { FakeNamespace } from "../../src/FakeNamespace";

describe("NamespaceHelper", () => {
  describe("isUnqualified", () => {
    it("returns true for no prefix and no URI", () => {
      // Arrange
      const ns = new FakeNamespace("", "");
      // Act & Assert
      expect(NamespaceHelper.isUnqualified(ns)).toBe(true);
    });

    it("returns false for prefix only", () => {
      // Arrange
      const ns = new FakeNamespace("p", "");
      // Act & Assert
      expect(NamespaceHelper.isUnqualified(ns)).toBe(false);
    });

    it("returns false for URI only", () => {
      // Arrange
      const ns = new FakeNamespace("", "uri");
      // Act & Assert
      expect(NamespaceHelper.isUnqualified(ns)).toBe(false);
    });

    it("returns false for prefix and URI", () => {
      // Arrange
      const ns = new FakeNamespace("p", "uri");
      // Act & Assert
      expect(NamespaceHelper.isUnqualified(ns)).toBe(false);
    });
  });

  describe("isDefault", () => {
    it("returns true for no prefix and non-empty URI", () => {
      // Arrange
      const ns = new FakeNamespace("", "uri");
      // Act & Assert
      expect(NamespaceHelper.isDefault(ns)).toBe(true);
    });

    it("returns false for no prefix and empty URI", () => {
      // Arrange
      const ns = new FakeNamespace("", "");
      // Act & Assert
      expect(NamespaceHelper.isDefault(ns)).toBe(false);
    });

    it("returns false for prefix and URI", () => {
      // Arrange
      const ns = new FakeNamespace("p", "uri");
      // Act & Assert
      expect(NamespaceHelper.isDefault(ns)).toBe(false);
    });

    it("returns false for prefix and empty URI", () => {
      // Arrange
      const ns = new FakeNamespace("p", "");
      // Act & Assert
      expect(NamespaceHelper.isDefault(ns)).toBe(false);
    });
  });

  describe("hasPrefix", () => {
    it("returns true for non-empty prefix", () => {
      // Arrange
      const ns = new FakeNamespace("p", "uri");
      // Act & Assert
      expect(NamespaceHelper.hasPrefix(ns)).toBe(true);
    });

    it("returns false for empty prefix", () => {
      // Arrange
      const ns = new FakeNamespace("", "uri");
      // Act & Assert
      expect(NamespaceHelper.hasPrefix(ns)).toBe(false);
    });
  });

  describe("canCoexist", () => {
    it("returns true for different prefixes", () => {
      // Arrange
      const ns1 = new FakeNamespace("p1", "uri1");
      const ns2 = new FakeNamespace("p2", "uri2");
      // Act & Assert
      expect(NamespaceHelper.canCoexist(ns1, ns2)).toBe(true);
    });

    it("returns true for same prefix and same URI", () => {
      // Arrange
      const ns1 = new FakeNamespace("p", "uri");
      const ns2 = new FakeNamespace("p", "uri");
      // Act & Assert
      expect(NamespaceHelper.canCoexist(ns1, ns2)).toBe(true);
    });

    it("returns false for same prefix and different URI", () => {
      // Arrange
      const ns1 = new FakeNamespace("p", "uri1");
      const ns2 = new FakeNamespace("p", "uri2");
      // Act & Assert
      expect(NamespaceHelper.canCoexist(ns1, ns2)).toBe(false);
    });

    it("returns true for empty prefix and different URIs", () => {
      // Arrange
      const ns1 = new FakeNamespace("", "uri1");
      const ns2 = new FakeNamespace("", "uri2");
      // Act & Assert
      expect(NamespaceHelper.canCoexist(ns1, ns2)).toBe(false);
    });

    it("returns true for empty prefix and same URI", () => {
      // Arrange
      const ns1 = new FakeNamespace("", "uri");
      const ns2 = new FakeNamespace("", "uri");
      // Act & Assert
      expect(NamespaceHelper.canCoexist(ns1, ns2)).toBe(true);
    });
  });
});
