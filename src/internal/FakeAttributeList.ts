import { FakeAttribute } from "../FakeAttribute";
import { InvalidArgumentException } from "../errors/InvalidArgumentException";
import { NameConflictException } from "../errors/NameConflictException";
import { AttributeOwner } from "../interfaces/AttributeOwner";
import { NamespaceHelper } from "./NamespaceHelper";

/**
 * A class that manages a list of XML Attribute objects for an AttributeOwner.
 */
export class FakeAttributeList {
  /** The AttributeOwner that owns this list. */
  private owner: AttributeOwner;
  /** The list of XML Attribute objects. */
  private attrs: FakeAttribute[] = [];

  /**
   * Creates an instance of FakeAttributeList.
   * @param owner The AttributeOwner that owns this list.
   */
  constructor(owner: AttributeOwner) {
    this.owner = owner;
  }

  /**
   * Clones the attribute list.
   * @param newOwner The new AttributeOwner for the cloned list.
   * @returns The cloned FakeAttributeList.
   */
  clone(newOwner: AttributeOwner): FakeAttributeList {
    const newManager = new FakeAttributeList(newOwner);
    this.attrs.forEach((attr) => newManager.set(attr._clone()));
    return newManager;
  }

  /**
   * Gets all attributes in the list.
   * @returns All attributes in the list.
   */
  getAll(): GoogleAppsScript.XML_Service.Attribute[] {
    return [...this.attrs];
  }

  /**
   * Gets the attribute with the specified name and namespace.
   * @param name The name of the attribute to get.
   * @param namespace The namespace of the attribute to get.
   * @returns The attribute with the specified name and namespace, or null if not found.
   */
  get(
    name: string,
    namespace: GoogleAppsScript.XML_Service.Namespace
  ): GoogleAppsScript.XML_Service.Attribute | null {
    return (
      this.attrs.find((attr) => this.equalsNameAndUri(attr, name, namespace)) ||
      null
    );
  }

  /**
   * Sets the specified attribute.
   * @param attribute The attribute to set.
   */
  set(attribute: FakeAttribute) {
    if (attribute._getOwner()) {
      throw new InvalidArgumentException("attribute", "already attached");
    }

    const attrName = attribute.getName();
    const attrNamespace = attribute.getNamespace();

    if (
      NamespaceHelper.hasPrefix(attrNamespace) &&
      !NamespaceHelper.canCoexist(this.owner.getNamespace(), attrNamespace)
    ) {
      throw new NameConflictException(attrNamespace, attrName);
    }

    if (!this.isNamespaceCompatible(attrNamespace)) {
      throw new NameConflictException(attrNamespace, attrName);
    }

    const index = this.attrs.findIndex((attr) =>
      this.equalsQualifiedName(attr, attrName, attrNamespace)
    );
    if (index >= 0) {
      // replace existing attribute
      const oldAttr = this.attrs[index]!;
      this.attrs[index] = attribute;
      oldAttr._setOwner(null);
    } else {
      // append new attribute
      this.attrs.push(attribute);
    }
    attribute._setOwner(this.owner);
  }

  /**
   * Removes the specified attribute.
   * @param attribute The attribute to remove.
   * @returns True if the attribute was removed, false otherwise.
   */
  remove(attribute: FakeAttribute): boolean {
    const index = this.attrs.indexOf(attribute);
    return this.removeAt(index);
  }

  /**
   * Removes the attribute with the specified name and namespace.
   * @param name The name of the attribute to remove.
   * @param namespace The namespace of the attribute to remove.
   * @returns True if the attribute was removed, false otherwise.
   */
  removeByName(
    name: string,
    namespace: GoogleAppsScript.XML_Service.Namespace
  ): boolean {
    const index = this.attrs.findIndex((attr) =>
      this.equalsNameAndUri(attr, name, namespace)
    );
    return this.removeAt(index);
  }

  /**
   * Removes the attribute at the specified index.
   * @param index The index of the attribute to remove.
   * @returns True if the attribute was removed, false otherwise.
   */
  removeAt(index: number): boolean {
    if (index < 0 || index >= this.attrs.length) return false;
    const oldAttr = this.attrs[index]!;
    this.attrs.splice(index, 1);
    oldAttr._setOwner(null);
    return true;
  }

  /**
   * Gets the namespace with the specified prefix.
   * @param prefix The prefix of the namespace to get.
   * @returns The namespace with the specified prefix, or null if not found.
   */
  getNamespace(prefix: string): GoogleAppsScript.XML_Service.Namespace | null {
    return (
      this.attrs
        .map((attr) => attr.getNamespace())
        .find((ns) => ns.getPrefix() === prefix) || null
    );
  }

  /**
   * Checks if the namespace of the specified attribute can be changed.
   * @param attr The attribute to change the namespace for.
   * @param namespace The namespace to change to.
   * @returns True if the namespace can be changed, false otherwise.
   */
  canChangeNamespace(
    attr: GoogleAppsScript.XML_Service.Attribute,
    namespace: GoogleAppsScript.XML_Service.Namespace
  ): boolean {
    if (NamespaceHelper.isUnqualified(namespace)) {
      // No namespace can always be set to attribute.
    } else if (NamespaceHelper.isDefault(namespace)) {
      // Default namespace cannot be set to attribute.
      return false;
    } else if (
      !NamespaceHelper.canCoexist(this.owner.getNamespace(), namespace)
    ) {
      // conflict with this element's namespace
      return false;
    } else if (!this.isNamespaceCompatible(namespace, attr)) {
      // conflict with other attributes' namespace
      return false;
    }

    return this.isAppendableName(attr.getName(), namespace, attr);
  }

  /**
   * Checks if the name of the specified attribute can be changed.
   * @param attr The attribute to change the name for.
   * @param name The name to change to.
   * @returns True if the name can be changed, false otherwise.
   */
  canChangeName(
    attr: GoogleAppsScript.XML_Service.Attribute,
    name: string
  ): boolean {
    return this.isAppendableName(name, attr.getNamespace(), attr);
  }

  /**
   * Checks if an attribute with the specified name and namespace can be added.
   * @param name The name of the attribute to check.
   * @param namespace The namespace of the attribute to check.
   * @param excludeAttr The attribute to exclude from the check (optional).
   * @returns True if the attribute can be added, false otherwise.
   */
  isAppendableName(
    name: string,
    namespace: GoogleAppsScript.XML_Service.Namespace,
    excludeAttr?: GoogleAppsScript.XML_Service.Attribute
  ): boolean {
    return this.attrs
      .filter((attr) => attr !== excludeAttr)
      .every((attr) => !this.equalsQualifiedName(attr, name, namespace));
  }

  /**
   * Checks if the specified namespace is compatible with the existing attributes.
   * @param namespace The attribute namespace to check.
   * @param excludeAttr The attribute to exclude from the check (optional).
   * @returns True if the namespace is compatible, false otherwise.
   */
  isNamespaceCompatible(
    namespace: GoogleAppsScript.XML_Service.Namespace,
    excludeAttr?: GoogleAppsScript.XML_Service.Attribute
  ): boolean {
    return this.attrs
      .filter((attr) => attr !== excludeAttr)
      .every((attr) =>
        NamespaceHelper.canCoexist(attr.getNamespace(), namespace)
      );
  }

  /**
   * Checks if the qualified name of the specified attribute is equal to the given name and namespace.
   * @param attr The attribute to check.
   * @param name The name to check.
   * @param namespace The namespace to check.
   * @returns True if the qualified name is equal, false otherwise.
   */
  private equalsQualifiedName(
    attr: FakeAttribute,
    name: string,
    namespace: GoogleAppsScript.XML_Service.Namespace
  ): boolean {
    return (
      attr.getName() === name &&
      attr.getNamespace().getPrefix() === namespace.getPrefix()
    );
  }

  /**
   * Checks if the name and namespace of the specified attribute are equal to the given name and namespace.
   * @param attr The attribute to check.
   * @param name The name to check.
   * @param namespace The namespace to check.
   * @returns True if the name and namespace are equal, false otherwise.
   */
  private equalsNameAndUri(
    attr: FakeAttribute,
    name: string,
    namespace: GoogleAppsScript.XML_Service.Namespace
  ): boolean {
    return (
      attr.getName() === name &&
      attr.getNamespace().getURI() === namespace.getURI()
    );
  }
}
