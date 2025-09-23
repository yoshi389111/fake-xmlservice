import * as xmldom from "@xmldom/xmldom";
import { AbstractFakeContent } from "../../src/AbstractFakeContent";
import { FakeAttribute } from "../../src/FakeAttribute";
import { FakeCdata } from "../../src/FakeCdata";
import { FakeComment } from "../../src/FakeComment";
import { FakeDocType } from "../../src/FakeDocType";
import { FakeDocument } from "../../src/FakeDocument";
import { FakeElement } from "../../src/FakeElement";
import { FakeEntityRef } from "../../src/FakeEntityRef";
import { FakeNamespace } from "../../src/FakeNamespace";
import { FakeProcessingInstruction } from "../../src/FakeProcessingInstruction";
import { FakeText } from "../../src/FakeText";
import { FakeToXmldomConverter } from "../../src/internal/FakeToXmldomConverter";

describe("FakeToXmldomConverter", () => {
  describe("convertDocument", () => {
    it("should convert FakeDocument with root element", () => {
      // Arrange
      const doc = new FakeDocument();
      const root = new FakeElement("root", FakeNamespace.NO_NAMESPACE);
      doc.addContent(root);
      const converter = new FakeToXmldomConverter(true);
      // Act
      const xmldomDoc = converter.convertDocument(doc);
      // Assert
      expect(xmldomDoc.childNodes.length).toBe(1);
      expect(xmldomDoc.documentElement!.nodeName).toBe("root");
    });

    it("should convert FakeElement with text", () => {
      // Arrange
      const doc = new FakeDocument();
      const el = new FakeElement("el", FakeNamespace.NO_NAMESPACE);
      el.addContent(new FakeText("  hello  "));
      el.addContent(new FakeText("  "));
      doc.addContent(el);
      const converter = new FakeToXmldomConverter(true);
      // Act
      const xmldomDoc = converter.convertDocument(doc);
      // Assert
      const cdataNode = xmldomDoc.documentElement!.childNodes;
      expect(cdataNode.length).toBe(1);
      expect(cdataNode[0].textContent).toBe("hello");
      expect(cdataNode[0].nodeType).toBe(xmldom.Node.TEXT_NODE);
    });

    it("should convert not compact whitespace with text", () => {
      // Arrange
      const doc = new FakeDocument();
      const el = new FakeElement("el", FakeNamespace.NO_NAMESPACE);
      el.addContent(new FakeText("  hello  "));
      el.addContent(new FakeText("  "));
      doc.addContent(el);
      const converter = new FakeToXmldomConverter(false);
      // Act
      const xmldomDoc = converter.convertDocument(doc);
      // Assert
      const cdataNode = xmldomDoc.documentElement!.childNodes;
      expect(cdataNode.length).toBe(2);
      expect(cdataNode[0].textContent).toBe("  hello  ");
      expect(cdataNode[0].nodeType).toBe(xmldom.Node.TEXT_NODE);
      expect(cdataNode[1].textContent).toBe("  ");
      expect(cdataNode[1].nodeType).toBe(xmldom.Node.TEXT_NODE);
    });

    it("should convert FakeElement with cdata", () => {
      // Arrange
      const doc = new FakeDocument();
      const el = new FakeElement("el", FakeNamespace.NO_NAMESPACE);
      el.addContent(new FakeCdata("  <cdata>  "));
      el.addContent(new FakeCdata("  "));
      doc.addContent(el);
      const converter = new FakeToXmldomConverter(true);
      // Act
      const xmldomDoc = converter.convertDocument(doc);
      // Assert
      const cdataNode = xmldomDoc.documentElement!.childNodes;
      expect(cdataNode.length).toBe(1);
      expect(cdataNode[0].textContent).toBe("<cdata>");
      expect(cdataNode[0].nodeType).toBe(xmldom.Node.CDATA_SECTION_NODE);
    });

    it("should convert not compact whitespace with cdata", () => {
      // Arrange
      const doc = new FakeDocument();
      const el = new FakeElement("el", FakeNamespace.NO_NAMESPACE);
      el.addContent(new FakeCdata("  <cdata>  "));
      el.addContent(new FakeCdata("  "));
      doc.addContent(el);
      const converter = new FakeToXmldomConverter(false);
      // Act
      const xmldomDoc = converter.convertDocument(doc);
      // Assert
      const cdataNode = xmldomDoc.documentElement!.childNodes;
      expect(cdataNode.length).toBe(2);
      expect(cdataNode[0].textContent).toBe("  <cdata>  ");
      expect(cdataNode[0].nodeType).toBe(xmldom.Node.CDATA_SECTION_NODE);
      expect(cdataNode[1].textContent).toBe("  ");
      expect(cdataNode[1].nodeType).toBe(xmldom.Node.CDATA_SECTION_NODE);
    });

    it("should convert FakeComment", () => {
      // Arrange
      const doc = new FakeDocument();
      const el = new FakeElement("el", FakeNamespace.NO_NAMESPACE);
      el.addContent(new FakeComment("comment"));
      doc.addContent(el);
      const converter = new FakeToXmldomConverter(true);
      // Act
      const xmldomDoc = converter.convertDocument(doc);
      // Assert
      const commentNode = xmldomDoc.documentElement!.childNodes[0];
      expect(commentNode.textContent).toBe("comment");
      expect(commentNode.nodeType).toBe(xmldom.Node.COMMENT_NODE);
    });

    it("should convert FakeDocType. #1", () => {
      // Arrange
      const doc = new FakeDocument();
      doc.addContent(new FakeDocType("html", "pubId", "sysId", null));
      const converter = new FakeToXmldomConverter(true);
      // Act
      const xmldomDoc = converter.convertDocument(doc);
      // Assert
      const doctypeNode = xmldomDoc.childNodes[0];
      expect(doctypeNode.nodeType).toBe(xmldom.Node.DOCUMENT_TYPE_NODE);
      expect((doctypeNode as xmldom.DocumentType).name).toBe("html");
      expect((doctypeNode as xmldom.DocumentType).systemId).toBe("sysId");
      expect((doctypeNode as xmldom.DocumentType).publicId).toBe("pubId");
    });

    it("should convert FakeDocType. #2", () => {
      // Arrange
      const doc = new FakeDocument();
      doc.addContent(new FakeDocType("html", null, null, null));
      const converter = new FakeToXmldomConverter(true);
      // Act
      const xmldomDoc = converter.convertDocument(doc);
      // Assert
      const doctypeNode = xmldomDoc.childNodes[0];
      expect(doctypeNode.nodeType).toBe(xmldom.Node.DOCUMENT_TYPE_NODE);
      expect((doctypeNode as xmldom.DocumentType).name).toBe("html");
      expect((doctypeNode as xmldom.DocumentType).systemId).toBe("");
      expect((doctypeNode as xmldom.DocumentType).publicId).toBe("");
    });

    it("should convert FakeProcessingInstruction", () => {
      // Arrange
      const doc = new FakeDocument();
      doc.addContent(new FakeProcessingInstruction("data", "target"));
      const converter = new FakeToXmldomConverter(true);
      // Act
      const xmldomDoc = converter.convertDocument(doc);
      // Assert
      const piNode = xmldomDoc.childNodes[0];
      expect(piNode.nodeType).toBe(xmldom.Node.PROCESSING_INSTRUCTION_NODE);
      expect((piNode as xmldom.ProcessingInstruction).target).toBe("target");
      expect((piNode as xmldom.ProcessingInstruction).data).toBe("data");
    });

    it("should convert FakeEntityRef as comment", () => {
      // Arrange
      const doc = new FakeDocument();
      const el = new FakeElement("el", FakeNamespace.NO_NAMESPACE);
      el.addContent(new FakeEntityRef());
      doc.addContent(el);
      const converter = new FakeToXmldomConverter(true);
      // Act
      const xmldomDoc = converter.convertDocument(doc);
      // Assert
      const node = xmldomDoc.documentElement!.childNodes[0];
      expect(node.nodeType).toBe(xmldom.Node.COMMENT_NODE); // EntityRef is converted to comment
    });

    it("should convert element with attribute", () => {
      // Arrange
      const doc = new FakeDocument();
      const ns = new FakeNamespace("", "");
      const el = new FakeElement("el", ns);
      el.setAttribute("attr", "val", ns);
      doc.addContent(el);
      const converter = new FakeToXmldomConverter(true);
      // Act
      const xmldomDoc = converter.convertDocument(doc);
      // Assert
      const attr = xmldomDoc.documentElement!.getAttribute("attr");
      expect(attr).toBe("val");
    });

    it("should convert element with attribute and namespace", () => {
      // Arrange
      const doc = new FakeDocument();
      const ns = new FakeNamespace("p", "http://example.com");
      const el = new FakeElement("el", ns);
      el.setAttribute("attr", "val", ns);
      doc.addContent(el);
      const converter = new FakeToXmldomConverter(true);
      // Act
      const xmldomDoc = converter.convertDocument(doc);
      // Assert
      const attr = xmldomDoc.documentElement!.getAttributeNS(
        "http://example.com",
        "attr"
      );
      expect(attr).toBe("val");
    });
  });

  describe("convertElement", () => {
    it("should convert FakeElement", () => {
      // Arrange
      const root = new FakeElement("root", FakeNamespace.NO_NAMESPACE);
      const child = new FakeElement("child", FakeNamespace.NO_NAMESPACE);
      root.addContent(child);
      const converter = new FakeToXmldomConverter(true);
      // Act
      const xmldomDoc = converter.convertElement(root);
      // Assert
      expect(xmldomDoc.childNodes.length).toBe(1);
      expect(xmldomDoc.nodeName).toBe("root");
      expect(xmldomDoc.childNodes[0].nodeName).toBe("child");
    });

    it("should throw error if content is unknown node", () => {
      // Arrange
      class InvalidNode
        extends AbstractFakeContent
        implements GoogleAppsScript.XML_Service.Content
      {
        getValue(): string {
          throw new Error("Method not implemented.");
        }
        _clone(): AbstractFakeContent {
          throw new Error("Method not implemented.");
        }
        getType(): GoogleAppsScript.XML_Service.ContentType {
          return {} as unknown as GoogleAppsScript.XML_Service.ContentType;
        }
      }
      const invalidContent = new InvalidNode();
      const el = new FakeElement("el", FakeNamespace.NO_NAMESPACE);
      el.addContent(invalidContent);
      const converter = new FakeToXmldomConverter(true);
      // Act & Assert
      expect(() => {
        converter.convertElement(el);
      }).toThrow(/convert failed:/);
    });

    it("should throw error when failed to convert attribute", () => {
      // Arrange
      class InvalidAttribute extends FakeAttribute {
        constructor() {
          super("attr", FakeNamespace.NO_NAMESPACE, "val");
        }
        getValue(): string {
          throw new Error("Method not implemented.");
        }
      }
      const el = new FakeElement("el", FakeNamespace.NO_NAMESPACE);
      el.setAttribute(new InvalidAttribute());
      const converter = new FakeToXmldomConverter(true);
      // Act & Assert
      expect(() => {
        converter.convertElement(el);
      }).toThrow(/convert failed:/);
    });
  });
});
