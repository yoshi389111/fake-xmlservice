import * as xmldom from "@xmldom/xmldom";
import { FakeCdata } from "../../src/FakeCdata";
import { FakeComment } from "../../src/FakeComment";
import { FakeDocType } from "../../src/FakeDocType";
import { FakeElement } from "../../src/FakeElement";
import { FakeEntityRef } from "../../src/FakeEntityRef";
import { FakeProcessingInstruction } from "../../src/FakeProcessingInstruction";
import { FakeText } from "../../src/FakeText";
import { XmldomToFakeConverter } from "../../src/internal/XmldomToFakeConverter";

describe("XmldomToFakeConverter", () => {
  const domImpl = new xmldom.DOMImplementation();

  describe("convert", () => {
    it("should convert element node", () => {
      // Arrange
      const doc = domImpl.createDocument(null, "root", null);
      const converter = new XmldomToFakeConverter();
      // Act
      const fakeDoc = converter.convert(doc);
      // Assert
      const fakeRoot = fakeDoc.getAllContent()[0];
      expect(fakeRoot).toBeInstanceOf(FakeElement);
      expect((fakeRoot as FakeElement).getName()).toBe("root");
    });

    it("should convert text node", () => {
      // Arrange
      const doc = domImpl.createDocument(null, "root", null);
      const text = doc.createTextNode("hello");
      doc.documentElement!.appendChild(text);
      const converter = new XmldomToFakeConverter();
      // Act
      const fakeDoc = converter.convert(doc);
      // Assert
      const fakeRoot = fakeDoc.getAllContent()[0] as FakeElement;
      const fakeText = fakeRoot.getAllContent()[0];
      expect(fakeText).toBeInstanceOf(FakeText);
      expect((fakeText as FakeText).getText()).toBe("hello");
    });

    it("should convert cdata node", () => {
      // Arrange
      const doc = domImpl.createDocument(null, "root", null);
      const cdata = doc.createCDATASection("cdata");
      doc.documentElement!.appendChild(cdata);
      const converter = new XmldomToFakeConverter();
      // Act
      const fakeDoc = converter.convert(doc);
      // Assert
      const fakeRoot = fakeDoc.getAllContent()[0] as FakeElement;
      expect(fakeRoot.getAllContent()[0]).toBeInstanceOf(FakeCdata);
      expect((fakeRoot.getAllContent()[0] as FakeCdata).getText()).toBe(
        "cdata"
      );
    });

    it("should convert comment node", () => {
      // Arrange
      const doc = domImpl.createDocument(null, "root", null);
      const comment = doc.createComment("comment");
      doc.documentElement!.appendChild(comment);
      const converter = new XmldomToFakeConverter();
      // Act
      const fakeDoc = converter.convert(doc);
      // Assert
      const fakeRoot = fakeDoc.getAllContent()[0] as FakeElement;
      const fakeComment = fakeRoot.getAllContent()[0];
      expect(fakeComment).toBeInstanceOf(FakeComment);
      expect((fakeComment as FakeComment).getText()).toBe("comment");
    });

    it("should convert entityRef node", () => {
      // Arrange
      const doc = domImpl.createDocument(null, "root", null);
      const entityRef = doc.createComment("entityRef");
      doc.documentElement!.appendChild(entityRef);
      Object.defineProperty(entityRef, "nodeType", {
        value: xmldom.Node.ENTITY_REFERENCE_NODE,
      });
      const converter = new XmldomToFakeConverter();
      // Act
      const fakeDoc = converter.convert(doc);
      // Assert
      const fakeRoot = fakeDoc.getAllContent()[0] as FakeElement;
      const fakeEntityRef = fakeRoot.getAllContent()[0];
      expect(fakeEntityRef).toBeInstanceOf(FakeEntityRef);
    });

    it("should convert doctype node #1", () => {
      // Arrange
      const doctype = domImpl.createDocumentType("html");
      const doc = domImpl.createDocument(null, "", doctype);
      const converter = new XmldomToFakeConverter();
      // Act
      const fakeDoc = converter.convert(doc);
      // Assert
      const fakeDoctype = fakeDoc.getAllContent()[0];
      expect(fakeDoctype).toBeInstanceOf(FakeDocType);
      if (fakeDoctype instanceof FakeDocType) {
        expect(fakeDoctype.getElementName()).toBe("html");
        expect(fakeDoctype.getPublicId()).toBe(null);
        expect(fakeDoctype.getSystemId()).toBe(null);
      }
    });

    it("should convert doctype node #2", () => {
      // Arrange
      const doctype = domImpl.createDocumentType("html", "pubId", "sysId");
      const doc = domImpl.createDocument(null, "", doctype);
      const converter = new XmldomToFakeConverter();
      // Act
      const fakeDoc = converter.convert(doc);
      // Assert
      const fakeDoctype = fakeDoc.getAllContent()[0];
      expect(fakeDoctype).toBeInstanceOf(FakeDocType);
      if (fakeDoctype instanceof FakeDocType) {
        expect(fakeDoctype.getElementName()).toBe("html");
        expect(fakeDoctype.getPublicId()).toBe("pubId");
        expect(fakeDoctype.getSystemId()).toBe("sysId");
      }
    });

    it("should convert processing instruction node", () => {
      // Arrange
      const doc = domImpl.createDocument(null, "root", null);
      const pi = doc.createProcessingInstruction("target", "data");
      doc.appendChild(pi);
      const converter = new XmldomToFakeConverter();
      // Act
      const fakeDoc = converter.convert(doc);
      // Assert
      const fakePI = fakeDoc.getAllContent()[1];
      expect(fakePI).toBeInstanceOf(FakeProcessingInstruction);
      if (fakePI instanceof FakeProcessingInstruction) {
        expect(fakePI.getTarget()).toBe("target");
        expect(fakePI.getData()).toBe("data");
      }
    });

    it("should convert element with attribute", () => {
      // Arrange
      const doc = domImpl.createDocument(null, "el", null);
      doc.documentElement!.setAttribute("xmlns", "http://www.example.com/url1");
      doc.documentElement!.setAttributeNS(
        "http://www.w3.org/2000/xmlns/",
        "xmlns:p",
        "http://www.example.com/url3"
      );
      doc.documentElement!.setAttribute("attr", "val2");
      const converter = new XmldomToFakeConverter();
      // Act
      const fakeDoc = converter.convert(doc);
      // Assert
      const fakeEl = fakeDoc.getAllContent()[0] as FakeElement;
      expect(fakeEl.getAttributes().length).toBe(1);
      const fakeAttr = fakeEl.getAttributes()[0];
      expect(fakeAttr.getName()).toBe("attr");
      expect(fakeAttr.getValue()).toBe("val2");
      expect(fakeAttr.getNamespace().getURI()).toBe("");
      expect(fakeAttr.getNamespace().getPrefix()).toBe("");
    });

    it("should convert element with attribute and namespace", () => {
      // Arrange
      const doc = domImpl.createDocument("http://example.com", "p:el", null);
      doc.documentElement!.setAttributeNS(
        "http://example.com",
        "p:attr",
        "val"
      );
      const converter = new XmldomToFakeConverter();
      // Act
      const fakeDoc = converter.convert(doc);
      // Assert
      const fakeRoot = fakeDoc.getAllContent()[0] as FakeElement;
      const fakeAttr = fakeRoot.getAttributes()[0];
      expect(fakeAttr.getName()).toBe("attr");
      expect(fakeAttr.getValue()).toBe("val");
      expect(fakeAttr.getNamespace().getURI()).toBe("http://example.com");
      expect(fakeAttr.getNamespace().getPrefix()).toBe("p");
    });
  });
});
