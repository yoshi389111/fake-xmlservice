import { FakeAttributeList } from "../internal/FakeAttributeList";

/**
 * An interface representing an owner of XML attributes.
 */
export interface AttributeOwner {
  /**
   * Gets the namespace of this owner.
   * @returns The namespace of this owner.
   */
  getNamespace(): GoogleAppsScript.XML_Service.Namespace;

  /**
   * Get the attributes of this owner.
   * @returns The attributes of this owner.
   * @internal
   */
  _getAttrs(): FakeAttributeList;
}
