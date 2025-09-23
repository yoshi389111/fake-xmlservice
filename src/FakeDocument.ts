import { InvalidArgumentException } from "./errors/InvalidArgumentException";
import { ParameterMismatchException } from "./errors/ParameterMismatchException";
import { FakeComment } from "./FakeComment";
import { FakeDocType } from "./FakeDocType";
import { FakeElement } from "./FakeElement";
import { FakeProcessingInstruction } from "./FakeProcessingInstruction";
import { ContentHolder } from "./interfaces/ContentHolder";
import { FakeContent } from "./interfaces/FakeContent";
import { FakeContentList } from "./internal/FakeContentList";
import { GasTypes } from "./internal/GasTypes";

/**
 * A fake implementation of the Document interface.
 */
export class FakeDocument
  implements GoogleAppsScript.XML_Service.Document, ContentHolder
{
  /** The list of contents in the document. */
  private _contents: FakeContentList = new FakeContentList(this);
  /** The root element of the document. */
  private _rootElement: FakeElement | null = null;
  /** The document type declaration of the document. */
  private _docType: FakeDocType | null = null;

  addContent(content: GoogleAppsScript.XML_Service.Content): FakeDocument;
  addContent(
    index: GoogleAppsScript.Integer,
    content: GoogleAppsScript.XML_Service.Content
  ): FakeDocument;

  addContent(
    ...args:
      | [content: GoogleAppsScript.XML_Service.Content]
      | [
          index: GoogleAppsScript.Integer,
          content: GoogleAppsScript.XML_Service.Content
        ]
  ): FakeDocument {
    if (args.length === 1 && GasTypes.isContent(args[0])) {
      const [content] = args;
      this._insertContent(this._contents.size(), content, "content");
      return this;
    }

    if (
      args.length === 2 &&
      typeof args[0] === "number" &&
      GasTypes.isContent(args[1])
    ) {
      const [index, content] = args;
      this._insertContent(index, content, "content");
      return this;
    }

    throw new ParameterMismatchException("FakeDocument.addContent", args);
  }

  /**
   * Insert content into the document at the specified index.
   * @param index The index at which to insert the content.
   * @param content The content to insert.
   * @param paramName The name of the parameter being validated.
   * @internal
   */
  _insertContent(index: number, content: FakeContent, paramName: string): void {
    this._contents.insertContent(index, content, paramName);
    if (content instanceof FakeElement) {
      this._rootElement = content;
    } else if (content instanceof FakeDocType) {
      this._docType = content;
    }
  }

  /**
   * Validate the insertion of content into the document.
   * @param content The content to insert.
   * @param index The index at which to insert the content.
   * @param paramName The name of the parameter being validated.
   * @internal
   */
  _validateContentInsertion(
    content: GoogleAppsScript.XML_Service.Content,
    index: number,
    paramName: string
  ): void {
    if (content instanceof FakeComment) return;
    if (content instanceof FakeProcessingInstruction) return;

    if (content instanceof FakeElement) {
      if (this._rootElement) {
        throw new InvalidArgumentException(paramName, "duplicate rootElement");
      }
      if (this._docType) {
        const indexOfDocType = this._contents.indexOf(this._docType);
        if (index <= indexOfDocType) {
          throw new InvalidArgumentException(
            paramName,
            "rootElement must be inserted after the docType"
          );
        }
      }
      return;
    }

    if (content instanceof FakeDocType) {
      if (this._docType) {
        throw new InvalidArgumentException(paramName, "duplicate docType");
      }
      if (this._rootElement) {
        const indexOfRoot = this._contents.indexOf(this._rootElement);
        if (index > indexOfRoot) {
          throw new InvalidArgumentException(
            paramName,
            "docType must be inserted before the rootElement"
          );
        }
      }
      return;
    }

    throw new InvalidArgumentException(
      paramName,
      `content type: ${content.getType()}`
    );
  }

  getAllContent(): GoogleAppsScript.XML_Service.Content[] {
    return this._contents.getAllContents();
  }

  getContent(index: GoogleAppsScript.Integer): FakeContent | null {
    if (typeof index !== "number") {
      throw new ParameterMismatchException("FakeDocument.getContent", [index]);
    }
    if (index < 0 || index >= this._contents.size()) return null;
    return this._contents.getContentAt(index);
  }

  getContentSize(): GoogleAppsScript.Integer {
    return this._contents.size();
  }

  removeContent(): GoogleAppsScript.XML_Service.Content[];
  removeContent(content: GoogleAppsScript.XML_Service.Content): boolean;
  removeContent(
    index: GoogleAppsScript.Integer
  ): GoogleAppsScript.XML_Service.Content | null;

  removeContent(
    ...args:
      | []
      | [content: GoogleAppsScript.XML_Service.Content]
      | [index: GoogleAppsScript.Integer]
  ):
    | GoogleAppsScript.XML_Service.Content[]
    | boolean
    | GoogleAppsScript.XML_Service.Content
    | null {
    if (args.length === 0) {
      return this._removeAllContents();
    }

    if (args.length === 1 && GasTypes.isContent(args[0])) {
      const [content] = args;
      return this._removeContent(content);
    }

    if (args.length === 1 && typeof args[0] === "number") {
      const [index] = args;
      return this._removeContentAt(index);
    }

    throw new ParameterMismatchException("FakeDocument.removeContent", args);
  }

  /**
   * Remove all contents from the document.
   * @returns The list of removed contents.
   */
  private _removeAllContents(): GoogleAppsScript.XML_Service.Content[] {
    const removedContents = this._contents.removeAllContents();
    this._rootElement = null;
    this._docType = null;
    return removedContents;
  }

  /**
   * Remove a specific content from the document.
   * @param content The content to remove.
   * @returns True if the content was removed, false otherwise.
   */
  private _removeContent(content: FakeContent): boolean {
    const index = this._contents.indexOf(content);
    if (index === -1) return false;

    this._removeContentAt(index);
    return true;
  }

  /**
   * Remove a specific content from the document.
   * @param index The index of the content to remove.
   * @returns The removed content, or null if the index is invalid.
   */
  private _removeContentAt(
    index: GoogleAppsScript.Integer
  ): GoogleAppsScript.XML_Service.Content | null {
    const content = this._contents.removeContentAt(index);
    if (content instanceof FakeElement) {
      this._rootElement = null;
    } else if (content instanceof FakeDocType) {
      this._docType = null;
    }
    return content;
  }

  cloneContent(): GoogleAppsScript.XML_Service.Content[] {
    return this._contents.cloneContents();
  }

  getRootElement(): FakeElement | null {
    return this._rootElement;
  }

  hasRootElement(): boolean {
    return Boolean(this._rootElement);
  }

  setRootElement(element: GoogleAppsScript.XML_Service.Element): FakeDocument {
    if (!(element instanceof FakeElement)) {
      throw new ParameterMismatchException("FakeDocument.setRootElement", [
        element,
      ]);
    }
    if (element._getParent()) {
      throw new InvalidArgumentException("element", "already attached");
    }
    if (this._rootElement) {
      const index = this._contents.indexOf(this._rootElement);
      this._removeContentAt(index);
      this._insertContent(index, element, "element");
    } else {
      this._insertContent(this._contents.size(), element, "element");
    }
    return this;
  }

  detachRootElement(): FakeElement | null {
    const element = this._rootElement;
    if (!element) return null;

    this._removeContent(element);
    return element;
  }

  getDocType(): FakeDocType | null {
    return this._docType;
  }

  setDocType(docType: GoogleAppsScript.XML_Service.DocType): FakeDocument {
    if (!(docType instanceof FakeDocType)) {
      throw new ParameterMismatchException("FakeDocument.setDocType", [
        docType,
      ]);
    }
    if (this._docType) {
      const index = this._contents.indexOf(this._docType);
      this._removeContentAt(index);
      this._insertContent(index, docType, "docType");
    } else {
      this._insertContent(0, docType, "docType");
    }
    return this;
  }

  getDescendants(): GoogleAppsScript.XML_Service.Content[] {
    const descendants: GoogleAppsScript.XML_Service.Content[] = [];
    this._contents.getAllContents().forEach((content) => {
      descendants.push(content);
      if (content instanceof FakeElement) {
        descendants.push(...content.getDescendants());
      }
    });
    return descendants;
  }

  toString(): string {
    return "[FakeDocument]";
  }
}
