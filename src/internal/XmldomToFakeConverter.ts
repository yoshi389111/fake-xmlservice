import * as xmldom from "@xmldom/xmldom";
import { ConvertException } from "../errors/ConvertException";
import { FakeCdata } from "../FakeCdata";
import { FakeComment } from "../FakeComment";
import { FakeDocType } from "../FakeDocType";
import { FakeDocument } from "../FakeDocument";
import { FakeElement } from "../FakeElement";
import { FakeEntityRef } from "../FakeEntityRef";
import { FakeNamespace } from "../FakeNamespace";
import { FakeProcessingInstruction } from "../FakeProcessingInstruction";
import { FakeText } from "../FakeText";
import { FakeContent } from "../interfaces/FakeContent";

/**
 * A converter from xmldom to FakeXmlService.
 */
export class XmldomToFakeConverter {
  /**
   * Converts an xmldom Document to a FakeDocument.
   * @param doc The xmldom Document to convert.
   * @returns The converted FakeDocument.
   */
  convert(doc: xmldom.Document): FakeDocument {
    try {
      const fakeDoc = new FakeDocument();
      for (const node of Array.from(doc.childNodes)) {
        if (
          node.nodeType === xmldom.Node.ELEMENT_NODE ||
          node.nodeType === xmldom.Node.PROCESSING_INSTRUCTION_NODE ||
          node.nodeType === xmldom.Node.COMMENT_NODE ||
          node.nodeType === xmldom.Node.DOCUMENT_TYPE_NODE
        ) {
          const fakeContent = this.toFakeContent(node);
          fakeDoc.addContent(fakeContent);
        }
      }
      return fakeDoc;
    } catch (e: unknown) {
      throw new ConvertException(`failed to convert document`, e);
    }
  }

  /**
   * Converts an xmldom Node to a FakeContent.
   * @param rawNode The xmldom Node to convert.
   * @returns The converted FakeContent.
   */
  private toFakeContent(rawNode: xmldom.Node): FakeContent {
    try {
      if (this.isElement(rawNode)) {
        const fakeNamespace = new FakeNamespace(
          rawNode.prefix || "",
          rawNode.namespaceURI || ""
        );
        const fakeElement = new FakeElement(rawNode.localName!, fakeNamespace);
        for (const child of Array.from(rawNode.childNodes)) {
          const fakeChild = this.toFakeContent(child);
          fakeElement.addContent(fakeChild);
        }
        for (const attr of Array.from(rawNode.attributes)) {
          try {
            if (attr.prefix === "xmlns" || attr.localName === "xmlns") {
              // skip namespace declaration
              continue;
            } else if (attr.namespaceURI) {
              const ns = new FakeNamespace(
                attr.prefix || "",
                attr.namespaceURI
              );
              fakeElement.setAttribute(attr.localName!, attr.value, ns);
            } else {
              fakeElement.setAttribute(attr.localName!, attr.value);
            }
          } catch (e: unknown) {
            throw new ConvertException(`failed to convert ${attr.nodeName}`, e);
          }
        }
        return fakeElement;
      } else if (this.isText(rawNode)) {
        return new FakeText(rawNode.data);
      } else if (this.isCdata(rawNode)) {
        return new FakeCdata(rawNode.data);
      } else if (this.isComment(rawNode)) {
        return new FakeComment(rawNode.data);
      } else if (this.isDocType(rawNode)) {
        return new FakeDocType(
          rawNode.name,
          rawNode.publicId || null,
          rawNode.systemId || null,
          rawNode.internalSubset || null
        );
      } else if (this.isEntityReference(rawNode)) {
        return new FakeEntityRef();
      } else if (this.isProcessingInstruction(rawNode)) {
        return new FakeProcessingInstruction(rawNode.data, rawNode.target);
      } else {
        throw new TypeError(`unsupported node type: ${rawNode.nodeType}`);
      }
    } catch (e: unknown) {
      throw new ConvertException(`failed to convert ${rawNode.nodeName}`, e);
    }
  }

  /**
   * Checks if the given node is a text node.
   * @param node The node to check.
   * @returns True if the node is a text node, false otherwise.
   */
  private isText(node: xmldom.Node): node is xmldom.Text {
    return node.nodeType === xmldom.Node.TEXT_NODE;
  }

  /**
   * Checks if the given node is a CDATA section.
   * @param node The node to check.
   * @returns True if the node is a CDATA section, false otherwise.
   */
  private isCdata(node: xmldom.Node): node is xmldom.CDATASection {
    return node.nodeType === xmldom.Node.CDATA_SECTION_NODE;
  }

  /**
   * Checks if the given node is a comment.
   * @param node The node to check.
   * @returns True if the node is a comment, false otherwise.
   */
  private isComment(node: xmldom.Node): node is xmldom.Comment {
    return node.nodeType === xmldom.Node.COMMENT_NODE;
  }

  /**
   * Checks if the given node is a document type.
   * @param node The node to check.
   * @returns True if the node is a document type, false otherwise.
   */
  private isDocType(node: xmldom.Node): node is xmldom.DocumentType {
    return node.nodeType === xmldom.Node.DOCUMENT_TYPE_NODE;
  }

  /**
   * Checks if the given node is an element.
   * @param node The node to check.
   * @returns True if the node is an element, false otherwise.
   */
  private isElement(node: xmldom.Node): node is xmldom.Element {
    return node.nodeType === xmldom.Node.ELEMENT_NODE;
  }

  /**
   * Checks if the given node is an entity reference.
   * @param node The node to check.
   * @returns True if the node is an entity reference, false otherwise.
   */
  private isEntityReference(node: xmldom.Node): node is xmldom.EntityReference {
    return node.nodeType === xmldom.Node.ENTITY_REFERENCE_NODE;
  }

  /**
   * Checks if the given node is a processing instruction.
   * @param node The node to check.
   * @returns True if the node is a processing instruction, false otherwise.
   */
  private isProcessingInstruction(
    node: xmldom.Node
  ): node is xmldom.ProcessingInstruction {
    return node.nodeType === xmldom.Node.PROCESSING_INSTRUCTION_NODE;
  }
}
