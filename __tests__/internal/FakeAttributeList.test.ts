import { FakeAttribute } from "../../src/FakeAttribute";
import { FakeElement } from "../../src/FakeElement";
import { FakeNamespace } from "../../src/FakeNamespace";
import { FakeAttributeList } from "../../src/internal/FakeAttributeList";
import { InvalidArgumentException } from "../../src/errors/InvalidArgumentException";
import { NameConflictException } from "../../src/errors/NameConflictException";

const NO_NAMESPACE = FakeNamespace.NO_NAMESPACE;

describe("FakeAttributeList", () => {
  describe("set", () => {
    it("should add and get attributes", () => {
      // Arrange
      const owner = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeAttributeList(owner);
      const ns = new FakeNamespace("p", "uri");
      const attr1 = new FakeAttribute("foo", ns, "v1");
      const attr2 = new FakeAttribute("bar", NO_NAMESPACE, "v2");
      // Act
      list.set(attr1);
      list.set(attr2);
      // Assert
      expect(list.getAll().length).toBe(2);
      expect(list.get("foo", ns)).toBe(attr1);
      expect(list.get("bar", NO_NAMESPACE)).toBe(attr2);
      expect(list.get("notfound", ns)).toBeNull();
    });

    it("should throw if setNode with already attached attribute", () => {
      // Arrange
      const owner = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeAttributeList(owner);
      const attr = new FakeAttribute("foo", NO_NAMESPACE, "v");
      attr._setOwner(owner);
      // Act & Assert
      expect(() => list.set(attr)).toThrow(InvalidArgumentException);
    });

    it("should replace attribute with same qualified name", () => {
      // Arrange
      const owner = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeAttributeList(owner);
      const ns = new FakeNamespace("p", "uri");
      const attr1 = new FakeAttribute("foo", ns, "v1");
      const attr2 = new FakeAttribute("foo", ns, "v2");
      // Act
      list.set(attr1);
      // Assert
      expect(list.get("foo", ns)).toBe(attr1);

      // Act
      list.set(attr2);
      // Assert
      expect(list.get("foo", ns)).toBe(attr2);
      expect(attr1._getOwner()).toBeNull();
      expect(attr2._getOwner()).toBe(owner);
      expect(list.getAll().length).toBe(1);
    });

    it("should throw NameConflictException if setNode with incompatible prefix", () => {
      // Arrange
      const owner = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeAttributeList(owner);
      const ns1 = new FakeNamespace("p", "uri1");
      const ns2 = new FakeNamespace("p", "uri2");
      owner.setNamespace(ns1);
      const attr = new FakeAttribute("foo", ns2, "v");
      // Act & Assert
      expect(() => list.set(attr)).toThrow(NameConflictException);
    });

    it("should throw NameConflictException if setNode with incompatible namespace", () => {
      // Arrange
      const owner = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeAttributeList(owner);
      const ns1 = new FakeNamespace("p", "uri1");
      const ns2 = new FakeNamespace("p", "uri2");
      const attr1 = new FakeAttribute("foo", ns1, "v");
      const attr2 = new FakeAttribute("bar", ns2, "v");
      list.set(attr1);
      // Act & Assert
      expect(() => list.set(attr2)).toThrow(NameConflictException);
    });
  });

  describe("remove", () => {
    it("should remove attribute by node", () => {
      // Arrange
      const owner = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeAttributeList(owner);
      const attr = new FakeAttribute("foo", NO_NAMESPACE, "v");
      list.set(attr);
      // Act & Assert
      expect(list.remove(attr)).toBe(true);
      // Assert
      expect(list.getAll().length).toBe(0);
      expect(attr._getOwner()).toBeNull();
    });

    it("should return false if remove not found", () => {
      // Arrange
      const owner = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeAttributeList(owner);
      const attr = new FakeAttribute("foo", NO_NAMESPACE, "v");
      // Act & Assert
      expect(list.remove(attr)).toBe(false);
    });
  });

  describe("removeByName", () => {
    it("should remove attribute by name and namespace", () => {
      // Arrange
      const owner = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeAttributeList(owner);
      const ns = new FakeNamespace("p", "uri");
      const attr = new FakeAttribute("foo", ns, "v");
      list.set(attr);
      // Act & Assert
      expect(list.removeByName("foo", ns)).toBe(true);
      // Assert
      expect(list.getAll().length).toBe(0);
    });

    it("should return false if removeByName by name/namespace not found", () => {
      // Arrange
      const owner = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeAttributeList(owner);
      // Act & Assert
      expect(list.removeByName("foo", NO_NAMESPACE)).toBe(false);
    });
  });

  describe("removeAt", () => {
    it("should removeAt by index", () => {
      // Arrange
      const owner = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeAttributeList(owner);
      const attr1 = new FakeAttribute("foo", NO_NAMESPACE, "v");
      const attr2 = new FakeAttribute("bar", NO_NAMESPACE, "v");
      list.set(attr1);
      list.set(attr2);
      // Act & Assert
      expect(list.removeAt(0)).toBe(true);
      // Assert
      expect(list.getAll().length).toBe(1);

      // Act & Assert
      expect(list.removeAt(10)).toBe(false);
    });
  });

  describe("getNamespace", () => {
    it("should getNamespace by prefix", () => {
      // Arrange
      const owner = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeAttributeList(owner);
      const ns = new FakeNamespace("p", "uri");
      const attr = new FakeAttribute("foo", ns, "v");
      list.set(attr);
      // Act & Assert
      expect(list.getNamespace("p")).toBe(ns);
      expect(list.getNamespace("x")).toBeNull();
    });
  });

  describe("canChangeNamespace", () => {
    it("canChangeNamespace returns false for default ns", () => {
      // Arrange
      const owner = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeAttributeList(owner);
      const attr = new FakeAttribute("foo", NO_NAMESPACE, "v");
      const defaultNs = new FakeNamespace("", "uri");
      // Act & Assert
      expect(list.canChangeNamespace(attr, defaultNs)).toBe(false);
    });

    it("canChangeNamespace returns false for conflict with owner", () => {
      // Arrange
      const owner = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeAttributeList(owner);
      const ns1 = new FakeNamespace("p", "uri1");
      const ns2 = new FakeNamespace("p", "uri2");
      owner.setNamespace(ns1);
      const attr = new FakeAttribute("foo", ns1, "v");
      // Act & Assert
      expect(list.canChangeNamespace(attr, ns2)).toBe(false);
    });

    it("canChangeNamespace returns false for conflict with other attrs", () => {
      // Arrange
      const owner = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeAttributeList(owner);
      const ns1 = new FakeNamespace("p", "uri1");
      const ns2 = new FakeNamespace("p", "uri2");
      const attr1 = new FakeAttribute("foo", ns1, "v");
      const attr2 = new FakeAttribute("bar", ns1, "v");
      list.set(attr1);
      list.set(attr2);
      // Act & Assert
      expect(list.canChangeNamespace(attr2, ns2)).toBe(false);
    });

    it("canChangeNamespace returns true for unqualified", () => {
      // Arrange
      const owner = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeAttributeList(owner);
      const attr = new FakeAttribute("foo", NO_NAMESPACE, "v");
      // Act & Assert
      expect(list.canChangeNamespace(attr, NO_NAMESPACE)).toBe(true);
    });
  });

  describe("canChangeName", () => {
    it("canChangeName returns false for duplicate", () => {
      // Arrange
      const owner = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeAttributeList(owner);
      const ns = new FakeNamespace("p", "uri");
      const attr1 = new FakeAttribute("foo", ns, "v");
      const attr2 = new FakeAttribute("bar", ns, "v");
      list.set(attr1);
      list.set(attr2);
      // Act & Assert
      expect(list.canChangeName(attr2, "foo")).toBe(false);
    });

    it("canChangeName returns true for unique", () => {
      // Arrange
      const owner = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeAttributeList(owner);
      const ns = new FakeNamespace("p", "uri");
      const attr1 = new FakeAttribute("foo", ns, "v");
      const attr2 = new FakeAttribute("bar", ns, "v");
      list.set(attr1);
      list.set(attr2);
      // Act & Assert
      expect(list.canChangeName(attr2, "baz")).toBe(true);
    });
  });

  describe("isAppendableName", () => {
    it("isAppendableName returns false for duplicate", () => {
      // Arrange
      const owner = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeAttributeList(owner);
      const ns = new FakeNamespace("p", "uri");
      const attr1 = new FakeAttribute("foo", ns, "v");
      list.set(attr1);
      // Act & Assert
      expect(list.isAppendableName("foo", ns)).toBe(false);
    });

    it("isAppendableName returns true for unique", () => {
      // Arrange
      const owner = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeAttributeList(owner);
      const ns = new FakeNamespace("p", "uri");
      // Act & Assert
      expect(list.isAppendableName("foo", ns)).toBe(true);
    });
  });

  describe("isNamespaceCompatible", () => {
    it("isNamespaceCompatible returns false for conflict", () => {
      // Arrange
      const owner = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeAttributeList(owner);
      const ns1 = new FakeNamespace("p", "uri1");
      const ns2 = new FakeNamespace("p", "uri2");
      const attr1 = new FakeAttribute("foo", ns1, "v");
      list.set(attr1);
      // Act & Assert
      expect(list.isNamespaceCompatible(ns2)).toBe(false);
    });

    it("isNamespaceCompatible returns true for compatible", () => {
      // Arrange
      const owner = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeAttributeList(owner);
      const ns = new FakeNamespace("p", "uri");
      // Act & Assert
      expect(list.isNamespaceCompatible(ns)).toBe(true);
    });
  });

  describe("clone", () => {
    it("clone should deep clone attributes", () => {
      // Arrange
      const owner = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeAttributeList(owner);
      const ns = new FakeNamespace("p", "uri");
      const attr1 = new FakeAttribute("foo", ns, "v1");
      const attr2 = new FakeAttribute("bar", NO_NAMESPACE, "v2");
      list.set(attr1);
      list.set(attr2);
      const newOwner = new FakeElement("new", ns);
      // Act
      const clone = list.clone(newOwner);
      // Assert
      expect(clone).not.toBe(list);
      expect(clone.getAll().length).toBe(2);
      expect(clone.get("foo", ns)?.getValue()).toBe("v1");
      expect(clone.get("bar", NO_NAMESPACE)?.getValue()).toBe("v2");
      expect(clone.get("foo", ns)).not.toBe(attr1);
    });
  });
});
