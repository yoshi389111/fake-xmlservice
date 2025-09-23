import { FakeDocument } from "../src/FakeDocument";
import { FakeElement } from "../src/FakeElement";
import { FakeFormat } from "../src/FakeFormat";
import { FakeNamespace } from "../src/FakeNamespace";
import { FakeText } from "../src/FakeText";

describe("FakeFormat", () => {
  describe("setEncoding", () => {
    it("should set encoding", () => {
      // Arrange
      const format = new FakeFormat();
      // Act & Assert
      expect(format.setEncoding("Shift_JIS")).toBe(format);
      // Assert
      expect(format._getEncoding()).toBe("Shift_JIS");
    });

    it("should throw Error when argument is not string", () => {
      // Arrange
      const format = new FakeFormat();
      // Act & Assert
      expect(() => {
        // @ts-expect-error
        format.setEncoding(123);
      }).toThrow(/invalid argument: encoding/);
    });
  });

  describe("setIndent", () => {
    it("should set indent", () => {
      // Arrange
      const format = new FakeFormat();
      // Act & Assert
      expect(format.setIndent(null)).toBe(format);
      // Assert
      expect(format._getIndent()).toBe(null);

      // Act & Assert
      expect(format.setIndent("    ")).toBe(format);
      // Assert
      expect(format._getIndent()).toBe("    ");
    });

    it("should throw Error when argument is not string or null", () => {
      // Arrange
      const format = new FakeFormat();
      // Act & Assert
      expect(() => {
        // @ts-expect-error
        format.setIndent(123);
      }).toThrow(/invalid argument: indent/);
    });
  });

  describe("setLineSeparator", () => {
    it("should set line separator", () => {
      // Arrange
      const format = new FakeFormat();
      // Act & Assert
      expect(format.setLineSeparator("\n")).toBe(format);
      // Assert
      expect(format._getLineSeparator()).toBe("\n");
    });

    it("should throw Error when argument is not string", () => {
      // Arrange
      const format = new FakeFormat();
      // Act & Assert
      expect(() => {
        // @ts-expect-error
        format.setLineSeparator(123);
      }).toThrow(/invalid argument: separator/);
    });
  });

  describe("setOmitDeclaration", () => {
    it("should set omitDeclaration", () => {
      // Arrange
      const format = new FakeFormat();
      // Act & Assert
      expect(format.setOmitDeclaration(true)).toBe(format);
      // Assert
      expect(format._getOmitDeclaration()).toBe(true);
    });

    it("should throw Error when argument is not boolean", () => {
      // Arrange
      const format = new FakeFormat();
      // Act & Assert
      expect(() => {
        // @ts-expect-error
        format.setOmitDeclaration(123);
      }).toThrow(/invalid argument: omitDeclaration/);
    });
  });

  describe("setOmitEncoding", () => {
    it("should set omitEncoding", () => {
      // Arrange
      const format = new FakeFormat();
      // Act & Assert
      expect(format.setOmitEncoding(true)).toBe(format);
      // Assert
      expect(format._getOmitEncoding()).toBe(true);
    });

    it("should throw Error when argument is not boolean", () => {
      // Arrange
      const format = new FakeFormat();
      // Act & Assert
      expect(() => {
        // @ts-expect-error
        format.setOmitEncoding(123);
      }).toThrow(/invalid argument: omitEncoding/);
    });
  });

  describe("_setCompactMode and _getCompactMode", () => {
    it("should set and get compactMode", () => {
      // Arrange
      const format = new FakeFormat();
      // Act & Assert
      expect(format._getCompactMode()).toBe(true);
      expect(format._setCompactMode(false)).toBe(format);
      expect(format._getCompactMode()).toBe(false);
      expect(format._setCompactMode(true)).toBe(format);
      expect(format._getCompactMode()).toBe(true);
    });
  });

  describe("format", () => {
    it("should format FakeDocument with declaration", () => {
      // Arrange
      const doc = new FakeDocument();
      const root = new FakeElement("root", FakeNamespace.NO_NAMESPACE);
      const child = new FakeElement("child", FakeNamespace.NO_NAMESPACE);
      const text = new FakeText("text");
      doc.addContent(root);
      root.addContent(child);
      child.addContent(text);
      const format = new FakeFormat();
      // Act
      const xml = format.format(doc);
      // Assert
      expect(xml).toBe(
        '<?xml version="1.0" encoding="UTF-8"?>\r\n<root>\r\n  <child>\r\n    text\r\n  </child>\r\n</root>'
      );
    });

    it("should format FakeDocument without declaration", () => {
      // Arrange
      const doc = new FakeDocument();
      const root = new FakeElement("root", FakeNamespace.NO_NAMESPACE);
      const child = new FakeElement("child", FakeNamespace.NO_NAMESPACE);
      const text = new FakeText("text");
      doc.addContent(root);
      root.addContent(child);
      child.addContent(text);
      const format = new FakeFormat().setOmitDeclaration(true);
      // Act
      const xml = format.format(doc);
      // Assert
      expect(xml).toBe(
        "<root>\r\n  <child>\r\n    text\r\n  </child>\r\n</root>"
      );
    });

    it("should format FakeDocument without encoding", () => {
      // Arrange
      const doc = new FakeDocument();
      const root = new FakeElement("root", FakeNamespace.NO_NAMESPACE);
      const child = new FakeElement("child", FakeNamespace.NO_NAMESPACE);
      const text = new FakeText("text");
      doc.addContent(root);
      root.addContent(child);
      child.addContent(text);
      const format = new FakeFormat().setOmitEncoding(true);
      // Act
      const xml = format.format(doc);
      // Assert
      expect(xml).toBe(
        '<?xml version="1.0"?>\r\n<root>\r\n  <child>\r\n    text\r\n  </child>\r\n</root>'
      );
    });

    it("should format FakeElement only", () => {
      // Arrange
      const root = new FakeElement("root", FakeNamespace.NO_NAMESPACE);
      const child = new FakeElement("child", FakeNamespace.NO_NAMESPACE);
      const text = new FakeText("text");
      root.addContent(child);
      child.addContent(text);
      const format = new FakeFormat().setIndent("");
      // Act
      const xml = format.format(root);
      // Assert
      expect(xml).toBe("<root>\r\n<child>\r\ntext\r\n</child>\r\n</root>");
    });

    it("should format with indent=null (compact)", () => {
      // Arrange
      const doc = new FakeDocument();
      const root = new FakeElement("root", FakeNamespace.NO_NAMESPACE);
      const child = new FakeElement("child", FakeNamespace.NO_NAMESPACE);
      const text = new FakeText("text");
      doc.addContent(root);
      root.addContent(child);
      child.addContent(text);
      const format = new FakeFormat().setIndent(null);
      // Act
      const xml = format.format(doc);
      // Assert
      expect(xml).toBe(
        '<?xml version="1.0" encoding="UTF-8"?>\r\n<root><child>text</child></root>'
      );
    });

    it("should throw error for invalid argument", () => {
      // Arrange
      const format = new FakeFormat();
      // Act & Assert
      expect(() =>
        // @ts-expect-error
        format.format({})
      ).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeFormat\.format/
      );
    });
  });
});
