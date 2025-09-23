import { InvalidArgumentException } from "../errors/InvalidArgumentException";
import { ContentHolder } from "../interfaces/ContentHolder";
import { FakeContent } from "../interfaces/FakeContent";
import { GasTypes } from "./GasTypes";

/**
 * A class that manages a list of XML Content objects for a ContentHolder.
 */
export class FakeContentList {
  /** The ContentHolder that owns this list. */
  private holder: ContentHolder;
  /** The list of XML Content objects. */
  private contents: FakeContent[];

  /**
   * Creates an instance of FakeContentList.
   * @param holder The ContentHolder that owns this list.
   */
  constructor(holder: ContentHolder) {
    this.holder = holder;
    this.contents = [];
  }

  /**
   * Clones the content list.
   * @param newHolder The new ContentHolder for the cloned list.
   * @returns The cloned FakeContentList.
   */
  clone(newHolder: ContentHolder): FakeContentList {
    const newManager = new FakeContentList(newHolder);
    this.contents.forEach((content) =>
      newManager.appendContent(content._clone(), "content")
    );
    return newManager;
  }

  /**
   * Clones the contents of the list.
   * @returns A shallow copy of the contents array.
   */
  cloneContents(): FakeContent[] {
    return this.contents.map((content) => content._clone());
  }

  /**
   * Appends a content object to the end of the list.
   * @param content The content object to append.
   * @param paramName The name of the parameter (for error messages).
   */
  appendContent(content: FakeContent, paramName: string) {
    this.insertContent(this.contents.length, content, paramName);
  }

  /**
   * Inserts a content object at the specified index.
   * @param index The index at which to insert the content.
   * @param content The content object to insert.
   * @param paramName The name of the parameter (for error messages).
   */
  insertContent(index: number, content: FakeContent, paramName: string) {
    if (content._getParent()) {
      throw new InvalidArgumentException(paramName, "already attached");
    }

    if (index < 0 || index > this.contents.length) {
      throw new InvalidArgumentException(
        "index",
        `length: ${this.contents.length}, index: ${index}`
      );
    }

    this.holder._validateContentInsertion(content, index, paramName);

    this.contents.splice(index, 0, content);
    content._setParent(this.holder);
  }

  /**
   * Removes all contents from the list.
   * @returns All contents removed from the list.
   */
  removeAllContents(): FakeContent[] {
    const removedContents = [...this.contents];
    this.contents = [];
    removedContents.forEach((content) => content._setParent(null));
    return removedContents;
  }

  /**
   * Removes a content object from the list.
   * @param content The content to remove.
   * @returns True if the content was removed, false otherwise.
   */
  removeContent(content: FakeContent): boolean {
    const index = this.contents.indexOf(content);
    if (index === -1) return false;
    this.removeContentAt(index);
    return true;
  }

  /**
   * Removes a content object from the list.
   * @param index The index of the content to remove.
   * @returns The removed content object, or null if the index is invalid.
   */
  removeContentAt(index: GoogleAppsScript.Integer): FakeContent | null {
    if (index < 0 || index >= this.contents.length) {
      return null;
    }
    const content = this.contents.splice(index, 1)[0]!;
    content._setParent(null);
    return content;
  }

  /**
   * Gets all contents in the list.
   * @returns All contents in the list.
   */
  getAllContents(): FakeContent[] {
    return [...this.contents];
  }

  /**
   * Gets the content at the specified index.
   * @param index The index of the content to get.
   * @returns The content at the specified index, or null if the index is invalid.
   */
  getContentAt(index: GoogleAppsScript.Integer): FakeContent | null {
    if (index < 0 || index >= this.contents.length) {
      return null;
    }
    return this.contents[index]!;
  }

  /**
   * Finds the index of the specified content.
   * @param content The content to find.
   * @returns The index of the content, or -1 if not found.
   */
  indexOf(content: FakeContent): number {
    return this.contents.indexOf(content);
  }

  /**
   * Gets the number of contents in the list.
   * @returns The number of contents in the list.
   */
  size(): number {
    return this.contents.length;
  }

  /**
   * Gets all elements in the content list.
   * @returns All elements in the content list.
   */
  getAllElements(): GoogleAppsScript.XML_Service.Element[] {
    return this.contents.filter((content) => GasTypes.isElement(content));
  }

  /**
   * Gets all elements with the specified name and namespace.
   * @param name The name of the elements to get.
   * @param namespace The namespace of the elements to get.
   * @returns All elements with the specified name and namespace.
   */
  getElements(
    name: string,
    namespace: GoogleAppsScript.XML_Service.Namespace
  ): GoogleAppsScript.XML_Service.Element[] {
    return this.getAllElements().filter((content) =>
      this.equalsNameAndUri(content, name, namespace)
    );
  }

  /**
   * Gets the content with the specified name and namespace.
   * @param name The name of the element to get.
   * @param namespace The namespace of the element to get.
   * @returns The content with the specified name and namespace, or null if not found.
   */
  getElement(
    name: string,
    namespace: GoogleAppsScript.XML_Service.Namespace
  ): GoogleAppsScript.XML_Service.Element | null {
    return (
      this.getAllElements().find((content) =>
        this.equalsNameAndUri(content, name, namespace)
      ) || null
    );
  }

  /**
   * Checks if the specified node has the same name and namespace as the given values.
   * @param node The XML element to check.
   * @param name The name to compare.
   * @param namespace The namespace to compare.
   * @returns True if the names and namespaces match, false otherwise.
   */
  private equalsNameAndUri(
    node: GoogleAppsScript.XML_Service.Element,
    name: string,
    namespace: GoogleAppsScript.XML_Service.Namespace
  ): boolean {
    return (
      node.getName() === name &&
      node.getNamespace().getURI() === namespace.getURI()
    );
  }
}
