import { FakeCdata } from "../src/FakeCdata";
import { FakeComment } from "../src/FakeComment";
import { FakeDocType } from "../src/FakeDocType";
import { FakeFormat } from "../src/FakeFormat";
import { FakeNamespace } from "../src/FakeNamespace";
import { FakeText } from "../src/FakeText";
import { FakeXmlService } from "../src/FakeXmlService";

describe("FakeXmlService", () => {
  const xmlService = new FakeXmlService();

  describe("createDocument", () => {
    it("should create a document without a root element", () => {
      // Act
      const doc = xmlService.createDocument();
      // Assert
      expect(doc.getRootElement()).toBeNull();
    });

    it("should create a document with a root element", () => {
      // Arrange
      const root = xmlService.createElement("root");
      // Act
      const doc = xmlService.createDocument(root);
      // Assert
      expect(doc.getRootElement()).toBe(root);
    });

    it("should throw an error when the argument is an invalid root element", () => {
      // Act & Assert
      expect(() => {
        // @ts-expect-error
        xmlService.createDocument({});
      }).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeXmlService\.createDocument/
      );
    });
  });

  describe("createElement", () => {
    it("should create an element and set/get name and namespace", () => {
      // Arrange
      const ns = xmlService.getNamespace("p", "http://example.com");
      // Act
      const el = xmlService.createElement("el", ns);
      // Assert
      expect(el.getName()).toBe("el");
      expect(el.getNamespace()).toBe(ns);
      expect(el.getQualifiedName()).toBe("p:el");
    });

    it("should throw an error when name is not a string", () => {
      // Act & Assert
      expect(() => {
        // @ts-expect-error
        xmlService.createElement(123);
      }).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeXmlService\.createElement/
      );
    });

    it("should throw an error when the argument is an invalid namespace", () => {
      // Act & Assert
      expect(() => {
        // @ts-expect-error
        xmlService.createElement("el", {});
      }).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeXmlService\.createElement/
      );
    });
  });

  describe("createText", () => {
    it("should create a text node", () => {
      // Act
      const text = xmlService.createText("abc");
      // Assert
      expect(text).toBeInstanceOf(FakeText);
      expect(text.getText()).toBe("abc");
    });
  });

  describe("createCdata", () => {
    it("should create a CDATA section", () => {
      // Act
      const cdata = xmlService.createCdata("xyz");
      // Assert
      expect(cdata).toBeInstanceOf(FakeCdata);
      expect(cdata.getText()).toBe("xyz");
    });
  });

  describe("createComment", () => {
    it("should create a comment node", () => {
      // Act
      const comment = xmlService.createComment("hello");
      // Assert
      expect(comment).toBeInstanceOf(FakeComment);
      expect(comment.getText()).toBe("hello");
    });
  });

  describe("createDocType", () => {
    it("should create a DocType with 1 argument", () => {
      // Act
      const docType = xmlService.createDocType("html");
      // Assert
      expect(docType).toBeInstanceOf(FakeDocType);
      expect(docType.getElementName()).toBe("html");
      expect(docType.getPublicId()).toBe(null);
      expect(docType.getSystemId()).toBe(null);
    });

    it("should create a DocType with 2 arguments", () => {
      // Act
      const docType = xmlService.createDocType("html", "sysId");
      // Assert
      expect(docType.getElementName()).toBe("html");
      expect(docType.getPublicId()).toBe(null);
      expect(docType.getSystemId()).toBe("sysId");
    });

    it("should create a DocType with 3 arguments", () => {
      // Act
      const docType = xmlService.createDocType("html", "pubId", "sysId");
      // Assert
      expect(docType.getElementName()).toBe("html");
      expect(docType.getPublicId()).toBe("pubId");
      expect(docType.getSystemId()).toBe("sysId");
    });

    it("should throw an error when arguments are invalid", () => {
      // Act & Assert
      expect(() =>
        xmlService.createDocType(
          "html",
          "pubId",
          "sysId",
          // @ts-expect-error
          "invalid"
        )
      ).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeXmlService\.createDocType/
      );
    });
  });

  describe("getNamespace", () => {
    it("should get a namespace with URI only", () => {
      // Act
      const ns = xmlService.getNamespace("http://example.com");
      // Assert
      expect(ns).toBeInstanceOf(FakeNamespace);
      expect(ns.getPrefix()).toBe("");
      expect(ns.getURI()).toBe("http://example.com");
    });

    it("should get a namespace with prefix and URI", () => {
      // Act
      const ns = xmlService.getNamespace("p", "http://example.com");
      // Assert
      expect(ns.getPrefix()).toBe("p");
      expect(ns.getURI()).toBe("http://example.com");
    });

    it("should throw an error when arguments are invalid", () => {
      // Act & Assert
      expect(() =>
        xmlService.getNamespace(
          "p",
          "http://example.com",
          // @ts-expect-error
          "invalid"
        )
      ).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeXmlService\.getNamespace/
      );
    });
  });

  describe("getNoNamespace", () => {
    it("should get a no-namespace object", () => {
      // Act
      const ns = xmlService.getNoNamespace();
      // Assert
      expect(ns.getPrefix()).toBe("");
      expect(ns.getURI()).toBe("");
    });
  });

  describe("getXmlNamespace", () => {
    it("should get the XML namespace", () => {
      // Act
      const ns = xmlService.getXmlNamespace();
      // Assert
      expect(ns.getPrefix()).toBe("xml");
      expect(ns.getURI()).toBe("http://www.w3.org/XML/1998/namespace");
    });
  });

  describe("parse", () => {
    it("should parse an XML string", () => {
      // Arrange
      const xml = `<root><child>abc</child></root>`;
      // Act
      const doc = xmlService.parse(xml);
      // Assert
      expect(doc.getRootElement()?.getName()).toBe("root");
      expect(doc.getRootElement()?.getChildren("child")[0].getText()).toBe(
        "abc"
      );
    });
  });

  describe("getCompactFormat", () => {
    it("should get the compact format", () => {
      // Act
      const format = xmlService.getCompactFormat();
      // Assert
      expect(format).toBeInstanceOf(FakeFormat);
      expect(format._getIndent()).toBe(null);
    });
  });

  describe("getPrettyFormat", () => {
    it("should get the pretty format", () => {
      // Act
      const format = xmlService.getPrettyFormat();
      // Assert
      expect(format).toBeInstanceOf(FakeFormat);
      expect(format._getIndent()).not.toBe(null);
    });
  });

  describe("getRawFormat", () => {
    it("should get the raw format", () => {
      // Act
      const format = xmlService.getRawFormat();
      // Assert
      expect(format).toBeInstanceOf(FakeFormat);
      expect(format._getIndent()).toBe(null);
    });
  });

  describe("ContentTypes", () => {
    it("should define ContentTypes", () => {
      // Assert
      expect(xmlService.ContentTypes).toBeDefined();
    });
  });
});
