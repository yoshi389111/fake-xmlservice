import { ContentHolder } from "./ContentHolder";

export interface FakeContent extends GoogleAppsScript.XML_Service.Content {
  __type: "FakeContent";

  asCdata(): GoogleAppsScript.XML_Service.Cdata | null;

  asComment(): GoogleAppsScript.XML_Service.Comment | null;

  asDocType(): GoogleAppsScript.XML_Service.DocType | null;

  asElement(): GoogleAppsScript.XML_Service.Element | null;

  asEntityRef(): GoogleAppsScript.XML_Service.EntityRef | null;

  asProcessingInstruction(): GoogleAppsScript.XML_Service.ProcessingInstruction | null;

  asText(): GoogleAppsScript.XML_Service.Text | null;

  detach(): GoogleAppsScript.XML_Service.Content;

  getParentElement(): GoogleAppsScript.XML_Service.Element | null;

  getType(): GoogleAppsScript.XML_Service.ContentType;

  getValue(): string;

  /**
   * Get a clone of this content.
   * @returns A clone of this content.
   * @internal
   */
  _clone(): FakeContent;

  /**
   * Get the parent of this content.
   * @returns The parent of this content, or null if it has no parent.
   * @internal
   */
  _getParent(): ContentHolder | null;

  /**
   * Set the parent of this content.
   * @param parent The parent to set, or null to remove the parent.
   * @internal
   */
  _setParent(parent: ContentHolder | null): void;
}
