import { Guards } from "../../src/internal/Guards";

describe("Guards", () => {
  describe("requireString", () => {
    it("should return the string as is", () => {
      // Act & Assert
      expect(Guards.requireString("abc", "param")).toBe("abc");
    });

    it("should throw if the value is null", () => {
      // Act & Assert
      expect(() => Guards.requireString(null, "param")).toThrow(
        /invalid argument: param/
      );
    });

    it("should throw if the value is undefined", () => {
      // Act & Assert
      expect(() => Guards.requireString(undefined, "param")).toThrow(
        /invalid argument: param/
      );
    });

    it("should throw if the value is not a string #1", () => {
      // Act & Assert
      expect(() => Guards.requireString(123, "param")).toThrow(
        /invalid argument: param/
      );
    });

    it("should throw if the value is not a string #2", () => {
      expect(() => Guards.requireString({}, "param")).toThrow(
        /invalid argument: param/
      );
    });

    it("should throw if the value is not a string #3", () => {
      expect(() => Guards.requireString(undefined, "param")).toThrow(
        /invalid argument: param/
      );
    });
  });

  describe("requireBoolean", () => {
    it("should return the boolean as is", () => {
      // Act & Assert
      expect(Guards.requireBoolean(true, "param")).toBe(true);
      expect(Guards.requireBoolean(false, "param")).toBe(false);
    });

    it("should throw if the value is null", () => {
      // Act & Assert
      expect(() => Guards.requireBoolean(null, "param")).toThrow(
        /invalid argument: param/
      );
    });

    it("should throw if the value is undefined", () => {
      // Act & Assert
      expect(() => Guards.requireBoolean(undefined, "param")).toThrow(
        /invalid argument: param/
      );
    });

    it("should throw if the value is not a boolean #1", () => {
      // Act & Assert
      expect(() => Guards.requireBoolean("true", "param")).toThrow(
        /invalid argument: param/
      );
    });

    it("should throw if the value is not a boolean #2", () => {
      // Act & Assert
      expect(() => Guards.requireBoolean(0, "param")).toThrow(
        /invalid argument: param/
      );
    });

    it("should throw if the value is not a boolean #3", () => {
      // Act & Assert
      expect(() => Guards.requireBoolean(null, "param")).toThrow(
        /invalid argument: param/
      );
    });
  });

  describe("requireValidXmlName", () => {
    it("should return the name if it is a valid XML name", () => {
      // Act & Assert
      expect(Guards.requireValidXmlName("foo", "name")).toBe("foo");
      expect(Guards.requireValidXmlName("foo_bar-123", "name")).toBe(
        "foo_bar-123"
      );
    });

    it("should throw if the name is not a valid XML name #1", () => {
      // Act & Assert
      expect(() => Guards.requireValidXmlName("xml", "name")).toThrow(
        /invalid argument: name/
      );
    });

    it("should throw if the name is not a valid XML name #2", () => {
      // Act & Assert
      expect(() => Guards.requireValidXmlName("1abc", "name")).toThrow(
        /invalid argument: name/
      );
    });

    it("should throw if the name is not a valid XML name #3", () => {
      // Act & Assert
      expect(() => Guards.requireValidXmlName("", "name")).toThrow(
        /invalid argument: name/
      );
    });

    it("should throw if the name is not a valid XML name #4", () => {
      // Act & Assert
      expect(() => Guards.requireValidXmlName("foo bar", "name")).toThrow(
        /invalid argument: name/
      );
    });
  });

  describe("isValidXmlName", () => {
    it("should return true for valid XML names", () => {
      // Act & Assert
      expect(Guards.isValidXmlName("foo")).toBe(true);
      expect(Guards.isValidXmlName("foo_bar-123")).toBe(true);
    });

    it("should return false for invalid XML names", () => {
      // Act & Assert
      expect(Guards.isValidXmlName("xml")).toBe(false);
      expect(Guards.isValidXmlName("Xml")).toBe(false);
      expect(Guards.isValidXmlName("1abc")).toBe(false);
      expect(Guards.isValidXmlName("foo bar")).toBe(false);
      expect(Guards.isValidXmlName("")).toBe(false);
      expect(
        // @ts-expect-error
        Guards.isValidXmlName(undefined)
      ).toBe(false);
    });
  });

  describe("requireValidPrefix", () => {
    it("should return the prefix if it is valid", () => {
      // Act & Assert
      expect(Guards.requireValidPrefix("", "")).toBe("");
      expect(
        Guards.requireValidPrefix("xml", "http://www.w3.org/XML/1998/namespace")
      ).toBe("xml");
      expect(Guards.requireValidPrefix("foo", "http://example.com/foo")).toBe(
        "foo"
      );
    });

    it("should throw if the prefix is invalid #1", () => {
      // Act & Assert
      expect(() =>
        Guards.requireValidPrefix("xml", "http://example.com/foo")
      ).toThrow(/invalid argument: prefix/);
    });

    it("should throw if the prefix is invalid #2", () => {
      // Act & Assert
      expect(() =>
        Guards.requireValidPrefix("1abc", "http://example.com/foo")
      ).toThrow(/invalid argument: prefix/);
    });

    it("should throw if the prefix is invalid #3", () => {
      // Act & Assert
      expect(() =>
        Guards.requireValidPrefix("foo bar", "http://example.com/foo")
      ).toThrow(/invalid argument: prefix/);
    });

    it("should throw if the prefix is invalid #4", () => {
      // Act & Assert
      expect(() =>
        Guards.requireValidPrefix("foo:bar", "http://example.com/foo")
      ).toThrow(/invalid argument: prefix/);
    });
  });

  describe("isValidPrefix", () => {
    it("should return true for valid prefixes", () => {
      // Act & Assert
      expect(Guards.isValidPrefix("", "")).toBe(true);
      expect(
        Guards.isValidPrefix("xml", "http://www.w3.org/XML/1998/namespace")
      ).toBe(true);
      expect(Guards.isValidPrefix("foo", "http://example.com/foo")).toBe(true);
    });

    it("should return false for invalid prefixes", () => {
      // Act & Assert
      expect(Guards.isValidPrefix("foobar", "http://example.com/foo")).toBe(
        true
      );
      expect(Guards.isValidPrefix("xml", "http://example.com/foo")).toBe(false);
      expect(Guards.isValidPrefix("1abc", "http://example.com/foo")).toBe(
        false
      );
      expect(Guards.isValidPrefix("foo bar", "http://example.com/foo")).toBe(
        false
      );
      expect(Guards.isValidPrefix("foo:bar", "http://example.com/foo")).toBe(
        false
      );
    });
  });
});
