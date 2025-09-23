import { FakeContent } from "../interfaces/FakeContent";
import { FakeContentTypes } from "./FakeContentTypes";

/**
 * Type guards for Google Apps Script XML Service types.
 * These functions check if a given object conforms to specific GAS XML Service interfaces.
 */
export namespace GasTypes {
  /**
   * Checks if the given object is a Document.
   * @param obj The object to check.
   * @returns True if the object is a Document, false otherwise.
   */
  export function isDocument(
    obj: unknown
  ): obj is GoogleAppsScript.XML_Service.Document {
    return obj !== null && typeof obj === "object" && "getRootElement" in obj;
  }

  /**
   * Checks if the given object is a Content.
   * @param obj The object to check.
   * @returns True if the object is a Content, false otherwise.
   */
  export function isContent(obj: unknown): obj is FakeContent {
    return (
      typeof obj === "object" &&
      obj !== null &&
      "__type" in obj &&
      (obj as any).__type === "FakeContent"
    );
  }

  /**
   * Checks if the given object is a DocType.
   * @param obj The object to check.
   * @returns True if the object is a DocType, false otherwise.
   */
  export function isDocType(
    obj: unknown
  ): obj is GoogleAppsScript.XML_Service.DocType {
    return isContent(obj) && obj.getType() === FakeContentTypes.DOCTYPE;
  }

  /**
   * Checks if the given object is an Element.
   * @param obj The object to check.
   * @returns True if the object is an Element, false otherwise.
   */
  export function isElement(
    obj: unknown
  ): obj is GoogleAppsScript.XML_Service.Element {
    return isContent(obj) && obj.getType() === FakeContentTypes.ELEMENT;
  }
}
