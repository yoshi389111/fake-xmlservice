import { ContentHolder } from "./interfaces/ContentHolder";
import { FakeContent } from "./interfaces/FakeContent";
import { GasTypes } from "./internal/GasTypes";

/**
 * An abstract base class for XML Content implementations.
 */
export abstract class AbstractFakeContent implements FakeContent {
  /** A type identifier for FakeContent. */
  __type: "FakeContent" = "FakeContent";

  /** The parent of this content, or null if it has no parent. */
  private _parent: ContentHolder | null = null;

  asCdata(): GoogleAppsScript.XML_Service.Cdata | null {
    return null;
  }

  asComment(): GoogleAppsScript.XML_Service.Comment | null {
    return null;
  }

  asDocType(): GoogleAppsScript.XML_Service.DocType | null {
    return null;
  }

  asElement(): GoogleAppsScript.XML_Service.Element | null {
    return null;
  }

  asEntityRef(): GoogleAppsScript.XML_Service.EntityRef | null {
    return null;
  }

  asProcessingInstruction(): GoogleAppsScript.XML_Service.ProcessingInstruction | null {
    return null;
  }

  asText(): GoogleAppsScript.XML_Service.Text | null {
    return null;
  }

  detach(): GoogleAppsScript.XML_Service.Content {
    if (this._parent) {
      this._parent.removeContent(this);
    }
    return this;
  }

  getParentElement(): GoogleAppsScript.XML_Service.Element | null {
    return GasTypes.isElement(this._parent) ? this._parent : null;
  }

  abstract getType(): GoogleAppsScript.XML_Service.ContentType;

  abstract getValue(): string;

  /**
   * Get a clone of this content.
   * @returns A clone of this content.
   * @internal
   */
  abstract _clone(): FakeContent;

  /**
   * Get the parent of this content.
   * @returns The parent of this content, or null if it has no parent.
   * @internal
   */
  _getParent(): ContentHolder | null {
    return this._parent;
  }

  /**
   * Set the parent of this content.
   * @param parent The parent to set, or null to remove the parent.
   * @internal
   */
  _setParent(parent: ContentHolder | null): void {
    this._parent = parent;
  }
}
