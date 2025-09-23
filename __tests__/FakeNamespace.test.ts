import { FakeNamespace } from "../src/FakeNamespace";

describe("FakeNamespace", () => {
  describe("constructor", () => {
    it("should create an instance with valid prefix and uri", () => {
      // Act
      const ns = new FakeNamespace("foo", "http://example.com");
      // Assert
      expect(ns.getPrefix()).toBe("foo");
      expect(ns.getURI()).toBe("http://example.com");
    });

    it("should allow empty prefix and uri", () => {
      // Act
      const ns = new FakeNamespace("", "");
      // Assert
      expect(ns.getPrefix()).toBe("");
      expect(ns.getURI()).toBe("");
    });

    it("should allow standard xml namespace", () => {
      // Act
      const ns = new FakeNamespace(
        "xml",
        "http://www.w3.org/XML/1998/namespace"
      );
      // Assert
      expect(ns.getPrefix()).toBe("xml");
      expect(ns.getURI()).toBe("http://www.w3.org/XML/1998/namespace");
    });

    it("should throw error for invalid prefix", () => {
      // Act & Assert
      expect(
        () => new FakeNamespace("1_invalid", "http://example.com")
      ).toThrow('invalid argument: prefix - invalid XML name: "1_invalid"');
    });

    it("should throw error for invalid prefix #2", () => {
      // Act & Assert
      expect(() => new FakeNamespace("xmltest", "http://example.com")).toThrow(
        'invalid argument: prefix - invalid XML name: "xmltest"'
      );
    });

    it("should throw error for invalid prefix #3", () => {
      // Act & Assert
      expect(() => new FakeNamespace("xml", "http://example.com")).toThrow(
        'invalid argument: prefix - invalid XML name: "xml"'
      );
    });

    it("should throw error for null prefix", () => {
      // Act & Assert
      expect(
        () => new FakeNamespace(null as unknown as string, "valid")
      ).toThrow(/invalid argument: prefix/);
    });

    it("should throw error for null uri", () => {
      // Act & Assert
      expect(
        () => new FakeNamespace("valid", null as unknown as string)
      ).toThrow(/invalid argument: uri/);
    });
  });

  describe("getPrefix and getURI methods", () => {
    it("should store and return prefix and uri", () => {
      // Arrange
      const ns = new FakeNamespace("foo", "http://example.com");
      // Act & Assert
      expect(ns.getPrefix()).toBe("foo");
      expect(ns.getURI()).toBe("http://example.com");
    });

    it("should handle empty prefix and uri", () => {
      // Arrange
      const ns = new FakeNamespace("", "");
      // Act & Assert
      expect(ns.getPrefix()).toBe("");
      expect(ns.getURI()).toBe("");
    });
  });

  describe("toString", () => {
    it("should return a string representation of the instance", () => {
      // Arrange
      const ns1 = new FakeNamespace("a", "http://www.example.com/uri1");
      // Act & Assert
      expect(ns1.toString()).toBe(
        '[Namespace: prefix "a" is mapped to URI "http://www.example.com/uri1"]'
      );
    });
  });
});
