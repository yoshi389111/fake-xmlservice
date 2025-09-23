import * as xmldom from "@xmldom/xmldom";
import { ConvertException } from "../errors/ConvertException";
import { FakeAttribute } from "../FakeAttribute";
import { FakeCdata } from "../FakeCdata";
import { FakeComment } from "../FakeComment";
import { FakeDocType } from "../FakeDocType";
import { FakeElement } from "../FakeElement";
import { FakeEntityRef } from "../FakeEntityRef";
import { FakeProcessingInstruction } from "../FakeProcessingInstruction";
import { FakeText } from "../FakeText";
import { FakeContent } from "../interfaces/FakeContent";

/**
 * A converter from FakeXmlService to xmldom.
 */
export class FakeToXmldomConverter {
  /** The DOM implementation to use for creating nodes. */
  private domImpl: xmldom.DOMImplementation = new xmldom.DOMImplementation();
  /** Whether to use compact mode for serialization. */
  private compactMode: boolean;

  /**
   * Creates an instance of the converter.
   * @param compactMode Whether to use compact mode for serialization. Default is false.
   */
  constructor(compactMode: boolean) {
    this.compactMode = compactMode;
  }

  /**
   * Converts a Fake XML Document to an xmldom Document.
   * @param fakeDoc The Fake XML Document to convert.
   * @returns The converted xmldom Document.
   */
  convertDocument(
    fakeDoc: GoogleAppsScript.XML_Service.Document
  ): xmldom.Document {
    const doc = this.domImpl.createDocument(null, "", null);
    for (const content of fakeDoc.getAllContent()) {
      const node = this.toRawNode(doc, content as FakeContent);
      if (node) {
        doc.appendChild(node);
      }
    }
    return doc;
  }

  /**
   * Converts a Fake XML Element to an xmldom Element.
   * @param fakeElement The Fake XML Element to convert.
   * @returns The converted xmldom Element.
   */
  convertElement(fakeElement: FakeContent): xmldom.Element {
    const doc = this.domImpl.createDocument(null, "", null);
    return this.toRawNode(doc, fakeElement) as xmldom.Element;
  }

  /**
   * Converts a Fake XML Content to an xmldom Node.
   * @param doc The xmldom Document to create the Node in.
   * @param fakeContent The Fake XML Content to convert.
   * @returns The converted xmldom Node.
   */
  private toRawNode(
    doc: xmldom.Document,
    fakeContent: FakeContent
  ): xmldom.Node | null {
    try {
      if (fakeContent instanceof FakeElement) {
        const element = doc.createElement(fakeContent.getName());
        for (const fakeChild of fakeContent.getAllContent()) {
          const childNode = this.toRawNode(doc, fakeChild as FakeContent);
          if (childNode) {
            element.appendChild(childNode);
          }
        }
        for (const fakeAttr of fakeContent.getAttributes()) {
          try {
            const ns = fakeAttr.getNamespace();
            if (ns.getURI()) {
              element.setAttributeNS(
                ns.getURI(),
                (fakeAttr as FakeAttribute)._getQualifiedName(),
                fakeAttr.getValue()
              );
            } else {
              element.setAttribute(fakeAttr.getName(), fakeAttr.getValue());
            }
          } catch (e: unknown) {
            throw new ConvertException(`failed to convert ${fakeAttr}`, e);
          }
        }
        return element;
      } else if (fakeContent instanceof FakeCdata) {
        if (this.compactMode) {
          const text = fakeContent.getText().trim();
          return text === "" ? null : doc.createCDATASection(text);
        } else {
          return doc.createCDATASection(fakeContent.getText());
        }
      } else if (fakeContent instanceof FakeText) {
        if (this.compactMode) {
          const text = fakeContent.getText().trim();
          return text === "" ? null : doc.createTextNode(text);
        } else {
          return doc.createTextNode(fakeContent.getText());
        }
      } else if (fakeContent instanceof FakeComment) {
        return doc.createComment(fakeContent.getText());
      } else if (fakeContent instanceof FakeDocType) {
        return this.domImpl.createDocumentType(
          fakeContent.getElementName(),
          fakeContent.getPublicId() || "",
          fakeContent.getSystemId() || ""
        );
      } else if (fakeContent instanceof FakeEntityRef) {
        // DOM interface entity references are obsolete.
        // See also: <https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model>
        return doc.createComment(fakeContent.getName());
      } else if (fakeContent instanceof FakeProcessingInstruction) {
        return doc.createProcessingInstruction(
          fakeContent.getTarget(),
          fakeContent.getData()
        );
      } else {
        throw new TypeError(
          `unsupported fake content type: ${fakeContent.constructor.name}`
        );
      }
    } catch (e: unknown) {
      throw new ConvertException(`failed to convert ${fakeContent}`, e);
    }
  }
}
