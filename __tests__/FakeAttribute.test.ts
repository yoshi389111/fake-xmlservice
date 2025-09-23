import { FakeAttribute } from "../src/FakeAttribute";
import { FakeElement } from "../src/FakeElement";
import { FakeNamespace } from "../src/FakeNamespace";

const NO_NAMESPACE = FakeNamespace.NO_NAMESPACE;

describe("FakeAttribute", () => {
  describe("constructor", () => {
    it("should construct", () => {
      // Arrange
      const ns = new FakeNamespace("pfx", "http://www.example.com/uri");
      // Act
      const attr = new FakeAttribute("foo", ns, "bar");
      // Assert
      expect(attr).toBeInstanceOf(FakeAttribute);
      expect(attr.getName()).toBe("foo");
      expect(attr.getNamespace()).toBe(ns);
      expect(attr.getValue()).toBe("bar");
    });

    it("should throw Error when argument is invalid namespace", () => {
      // Arrange
      const ns = new FakeNamespace("", "http://www.example.com/uri");
      // Act & Assert
      expect(() => {
        new FakeAttribute("foo", ns, "bar");
      }).toThrow(/invalid argument: namespace/);
    });
  });

  describe("getName", () => {
    it("should get the attribute name", () => {
      // Arrange
      const ns = new FakeNamespace("pfx", "http://www.example.com/uri");
      const attr = new FakeAttribute("foo", ns, "bar");
      // Act & Assert
      expect(attr.getName()).toBe("foo");
    });
  });

  describe("setName", () => {
    it("should set the attribute name", () => {
      // Arrange
      const ns = new FakeNamespace("pfx", "http://www.example.com/uri");
      const attr = new FakeAttribute("foo", ns, "bar");
      // Act
      attr.setName("baz");
      // Assert
      expect(attr.getName()).toBe("baz");
    });

    it("should throw an error when setting an invalid name", () => {
      // Arrange
      const ns = new FakeNamespace("pfx", "http://www.example.com/uri");
      const attr = new FakeAttribute("foo", ns, "bar");
      // Act & Assert
      expect(() => {
        attr.setName("");
      }).toThrow(/invalid argument: name/);
    });

    it("should throw an error when setting a non-string name", () => {
      // Arrange
      const ns = new FakeNamespace("pfx", "http://www.example.com/uri");
      const attr = new FakeAttribute("foo", ns, "bar");
      // Act & Assert
      expect(() => {
        // @ts-expect-error
        attr.setName(123);
      }).toThrow(/invalid argument: name/);
    });

    it("should throw an error when owner rejects renaming due to name conflict (case 1)", () => {
      // Arrange
      const ns = NO_NAMESPACE;
      const root = new FakeElement("root", ns);
      const attr1 = new FakeAttribute("foo", ns, "value2");
      const attr2 = new FakeAttribute("bar", ns, "value2");
      root.setAttribute(attr1);
      root.setAttribute(attr2);
      // Act & Assert
      expect(() => {
        attr2.setName("foo");
      }).toThrow(/name conflict: foo/);
    });

    it("should throw an error when owner rejects renaming due to name conflict (case 2)", () => {
      // Arrange
      const ns = new FakeNamespace("p", "http://example.com/uri1");
      const root = new FakeElement("root", ns);
      const attr1 = new FakeAttribute("foo", ns, "value2");
      const attr2 = new FakeAttribute("bar", ns, "value2");
      root.setAttribute(attr1);
      root.setAttribute(attr2);
      // Act & Assert
      expect(() => {
        attr2.setName("foo");
      }).toThrow(/name conflict: foo/);
    });
  });

  describe("getNamespace", () => {
    it("should get namespace", () => {
      // Arrange
      const ns1 = new FakeNamespace("pfx", "http://www.example.com/uri1");
      const attr = new FakeAttribute("foo", ns1, "bar");
      // Act & Assert
      expect(attr.getNamespace()).toBe(ns1);
    });
  });

  describe("setNamespace", () => {
    it("should set namespace", () => {
      // Arrange
      const ns1 = new FakeNamespace("pfx", "http://www.example.com/uri1");
      const ns2 = new FakeNamespace("pfx2", "http://www.example.com/uri2");
      const attr = new FakeAttribute("foo", ns1, "bar");
      expect(attr.getNamespace()).toBe(ns1);
      // Act
      attr.setNamespace(ns2);
      // Assert
      expect(attr.getNamespace()).toBe(ns2);
    });

    it("should throw Error when argument is not FakeNamespace", () => {
      // Arrange
      const ns1 = new FakeNamespace("pfx", "http://www.example.com/uri1");
      const attr = new FakeAttribute("foo", ns1, "bar");
      // Act & Assert
      expect(() => {
        // @ts-expect-error
        attr.setNamespace({});
      }).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeAttribute\.setNamespace/
      );
    });

    it("should throw Error when argument is invalid namespace", () => {
      // Arrange
      const ns1 = new FakeNamespace("pfx", "http://www.example.com/uri1");
      const attr = new FakeAttribute("foo", ns1, "bar");
      const ns2 = new FakeNamespace("", "http://www.example.com/uri2");
      // Act & Assert
      expect(() => {
        attr.setNamespace(ns2);
      }).toThrow(/invalid argument: namespace/);
    });

    it("should throw Error when owner rejects changing namespace #1", () => {
      // Arrange
      const ns = new FakeNamespace("pfx", "http://www.example.com/uri");
      const root = new FakeElement("root", NO_NAMESPACE);
      const attr1 = new FakeAttribute("foo", NO_NAMESPACE, "value2");
      const attr2 = new FakeAttribute("foo", ns, "value2");
      root.setAttribute(attr1);
      root.setAttribute(attr2);
      // Act & Assert
      expect(() => {
        attr2.setNamespace(NO_NAMESPACE);
      }).toThrow(/name conflict: foo/);
    });

    it("should throw Error when owner rejects changing namespace #2", () => {
      // Arrange
      const ns1 = new FakeNamespace("p", "http://example.com/uri1");
      const ns2 = new FakeNamespace("p", "http://example.com/uri2");
      const root = new FakeElement("root", ns1);
      const attr1 = new FakeAttribute("foo", NO_NAMESPACE, "value2");
      const attr2 = new FakeAttribute("bar", ns1, "value2");
      root.setAttribute(attr1);
      root.setAttribute(attr2);
      // Act & Assert
      expect(() => {
        attr2.setNamespace(ns2);
      }).toThrow(/name conflict: bar/);
    });

    it("should throw Error when owner rejects changing namespace #3", () => {
      // Arrange
      const ns1 = new FakeNamespace("p", "http://example.com/uri1");
      const ns2 = new FakeNamespace("p", "http://example.com/uri2");
      const root = new FakeElement("root", FakeNamespace.NO_NAMESPACE);
      const attr1 = new FakeAttribute("foo", ns1, "value2");
      const attr2 = new FakeAttribute("bar", ns1, "value2");
      root.setAttribute(attr1);
      root.setAttribute(attr2);
      // Act & Assert
      expect(() => {
        attr2.setNamespace(ns2);
      }).toThrow(/name conflict: bar/);
    });
  });

  describe("getValue and setValue", () => {
    it("should get and set value", () => {
      // Arrange
      const ns = new FakeNamespace("", "");
      const attr = new FakeAttribute("foo", ns, "bar");
      // Act & Assert
      expect(attr.getValue()).toBe("bar");
      // Act
      attr.setValue("baz");
      // Assert
      expect(attr.getValue()).toBe("baz");
    });
  });

  describe("_getQualifiedName", () => {
    it("should get qualified name", () => {
      // Arrange
      const ns = new FakeNamespace("pfx", "http://www.example.com/uri");
      const attr = new FakeAttribute("foo", ns, "bar");
      // Act & Assert
      expect(attr._getQualifiedName()).toBe("pfx:foo");

      // Arrange
      const ns2 = new FakeNamespace("", "");
      attr.setNamespace(ns2);
      // Act & Assert
      expect(attr._getQualifiedName()).toBe("foo");
    });
  });

  describe("_getOwner and _getOwner", () => {
    it("should get and set owner", () => {
      // Arrange
      const ns = new FakeNamespace("", "");
      const attr = new FakeAttribute("foo", ns, "bar");
      const elem = new FakeElement("el", ns);
      // Act & Assert
      expect(attr._getOwner()).toBeNull();
      attr._setOwner(elem);
      expect(attr._getOwner()).toBe(elem);
      attr._setOwner(null);
      expect(attr._getOwner()).toBeNull();
    });
  });

  describe("_clone", () => {
    it("should clone itself", () => {
      // Arrange
      const ns = new FakeNamespace("pfx", "http://www.example.com/uri");
      const attr = new FakeAttribute("foo", ns, "bar");
      // Act
      const clone = attr._clone();
      // Assert
      expect(clone).not.toBe(attr);
      expect(clone.getName()).toBe(attr.getName());
      expect(clone.getNamespace().getPrefix()).toBe(
        attr.getNamespace().getPrefix()
      );
      expect(clone.getNamespace().getURI()).toBe(attr.getNamespace().getURI());
      expect(clone.getValue()).toBe(attr.getValue());
    });
  });

  describe("toString", () => {
    it("should return string representation", () => {
      // Arrange
      const ns = new FakeNamespace("pfx", "http://www.example.com/uri");
      const attr = new FakeAttribute("foo", ns, "bar");
      // Act & Assert
      expect(attr.toString()).toBe('[FakeAttribute: pfx:foo="bar"]');
    });
  });
});
