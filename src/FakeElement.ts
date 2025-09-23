import { AbstractFakeContent } from "./AbstractFakeContent";
import { InvalidArgumentException } from "./errors/InvalidArgumentException";
import { NameConflictException } from "./errors/NameConflictException";
import { ParameterMismatchException } from "./errors/ParameterMismatchException";
import { FakeAttribute } from "./FakeAttribute";
import { FakeCdata } from "./FakeCdata";
import { FakeNamespace } from "./FakeNamespace";
import { FakeText } from "./FakeText";
import { AttributeOwner } from "./interfaces/AttributeOwner";
import { ContentHolder } from "./interfaces/ContentHolder";
import { FakeAttributeList } from "./internal/FakeAttributeList";
import { FakeContentList } from "./internal/FakeContentList";
import { FakeContentTypes } from "./internal/FakeContentTypes";
import { GasTypes } from "./internal/GasTypes";
import { Guards } from "./internal/Guards";

/**
 * A fake implementation of the Element interface.
 */
export class FakeElement
  extends AbstractFakeContent
  implements
    GoogleAppsScript.XML_Service.Element,
    AttributeOwner,
    ContentHolder
{
  /** The name of the element. */
  private _name: string;
  /** The namespace of the element. */
  private _namespace: GoogleAppsScript.XML_Service.Namespace;
  /** The list of contents of the element. */
  private _contents: FakeContentList;
  /** The list of attributes of the element. */
  private _attrs: FakeAttributeList;

  /**
   * Creates a new FakeElement.
   * @param name The name of the element.
   * @param namespace The namespace of the element.
   */
  constructor(name: string, namespace: GoogleAppsScript.XML_Service.Namespace) {
    super();
    this._name = Guards.requireValidXmlName(name, "name");
    this._namespace = namespace;
    this._contents = new FakeContentList(this);
    this._attrs = new FakeAttributeList(this);
  }

  getName(): string {
    return this._name;
  }

  setName(name: string): FakeElement {
    this._name = Guards.requireValidXmlName(name, "name");
    return this;
  }

  getQualifiedName(): string {
    const prefix = this._namespace.getPrefix();
    return prefix ? `${prefix}:${this._name}` : this._name;
  }

  getNamespace(): GoogleAppsScript.XML_Service.Namespace;
  getNamespace(prefix: string): GoogleAppsScript.XML_Service.Namespace | null;

  getNamespace(
    ...args: [] | [prefix: string]
  ): GoogleAppsScript.XML_Service.Namespace | null {
    if (args.length === 0) {
      return this._namespace;
    }

    if (args.length === 1 && typeof args[0] === "string") {
      const [prefix] = args;
      return (
        this._getNamespaceFromThisElement(prefix) ??
        this._getNamespaceFromAttributes(prefix) ??
        this._getNamespaceFromAncestors(prefix)
      );
    }

    throw new ParameterMismatchException("FakeElement.getNamespace", args);
  }

  /**
   * Get the namespace for a given prefix from this element.
   * @param prefix The prefix to look for.
   * @returns The namespace associated with the prefix, or null if not found.
   */
  private _getNamespaceFromThisElement(
    prefix: string
  ): GoogleAppsScript.XML_Service.Namespace | null {
    return this._namespace.getPrefix() === prefix ? this._namespace : null;
  }

  /**
   * Get the namespace for a given prefix from the element's attributes.
   * @param prefix The prefix to look for.
   * @returns The namespace associated with the prefix, or null if not found.
   */
  private _getNamespaceFromAttributes(
    prefix: string
  ): GoogleAppsScript.XML_Service.Namespace | null {
    return prefix !== "" ? this._attrs.getNamespace(prefix) : null;
  }

  /**
   * Get the namespace for a given prefix from the element's ancestors.
   * @param prefix The prefix to look for.
   * @returns The namespace associated with the prefix, or null if not found.
   */
  private _getNamespaceFromAncestors(
    prefix: string
  ): GoogleAppsScript.XML_Service.Namespace | null {
    const parent = this._getParent();
    if (parent instanceof FakeElement) {
      return parent.getNamespace(prefix);
    }
    return null;
  }

  setNamespace(namespace: GoogleAppsScript.XML_Service.Namespace): FakeElement {
    if (!(namespace instanceof FakeNamespace)) {
      throw new ParameterMismatchException("FakeElement.setNamespace", [
        namespace,
      ]);
    }

    if (
      namespace.getPrefix() !== "" &&
      !this._attrs.isNamespaceCompatible(namespace)
    ) {
      throw new NameConflictException(namespace);
    }

    this._namespace = namespace;
    return this;
  }

  addContent(content: GoogleAppsScript.XML_Service.Content): FakeElement;
  addContent(
    index: GoogleAppsScript.Integer,
    content: GoogleAppsScript.XML_Service.Content
  ): FakeElement;

  addContent(
    ...args:
      | [content: GoogleAppsScript.XML_Service.Content]
      | [
          index: GoogleAppsScript.Integer,
          content: GoogleAppsScript.XML_Service.Content
        ]
  ): FakeElement {
    if (args.length === 1 && GasTypes.isContent(args[0])) {
      const [content] = args;
      this._contents.appendContent(content, "content");
      return this;
    }

    if (
      args.length === 2 &&
      typeof args[0] === "number" &&
      GasTypes.isContent(args[1])
    ) {
      const [index, content] = args;
      this._contents.insertContent(index, content, "content");
      return this;
    }

    throw new ParameterMismatchException("FakeElement.addContent", args);
  }

  /**
   * Validate the insertion of content into the element.
   * @param content The content to insert.
   * @param _index The index at which to insert the content.
   * @param paramName The name of the parameter being validated.
   * @internal
   */
  _validateContentInsertion(
    content: GoogleAppsScript.XML_Service.Content,
    _index: number,
    paramName: string
  ): void {
    if (GasTypes.isDocType(content)) {
      throw new InvalidArgumentException(
        paramName,
        "docType cannot be added as content to an element"
      );
    }
  }

  cloneContent(): GoogleAppsScript.XML_Service.Content[] {
    return this._contents.cloneContents();
  }

  getAllContent(): GoogleAppsScript.XML_Service.Content[] {
    return this._contents.getAllContents();
  }

  getChild(name: string): FakeElement | null;
  getChild(
    name: string,
    namespace: GoogleAppsScript.XML_Service.Namespace
  ): FakeElement | null;

  getChild(
    ...args:
      | [name: string]
      | [name: string, namespace: GoogleAppsScript.XML_Service.Namespace]
  ): GoogleAppsScript.XML_Service.Element | null {
    if (args.length === 1 && typeof args[0] === "string") {
      const [name] = args;
      return this._contents.getElement(name, FakeNamespace.NO_NAMESPACE);
    }

    if (
      args.length === 2 &&
      typeof args[0] === "string" &&
      args[1] instanceof FakeNamespace
    ) {
      const [name, namespace] = args;
      return this._contents.getElement(name, namespace);
    }

    throw new ParameterMismatchException("FakeElement.getChild", args);
  }

  getChildText(name: string): string | null;
  getChildText(
    name: string,
    namespace: GoogleAppsScript.XML_Service.Namespace
  ): string | null;

  getChildText(
    ...args:
      | [name: string]
      | [name: string, namespace: GoogleAppsScript.XML_Service.Namespace]
  ): string | null {
    if (args.length === 1 && typeof args[0] === "string") {
      const [name] = args;
      return (
        this.getChild(name, FakeNamespace.NO_NAMESPACE)?.getValue() || null
      );
    }

    if (
      args.length === 2 &&
      typeof args[0] === "string" &&
      args[1] instanceof FakeNamespace
    ) {
      const [name, namespace] = args;
      return this.getChild(name, namespace)?.getValue() || null;
    }

    throw new ParameterMismatchException("FakeElement.getChildText", args);
  }

  getChildren(): GoogleAppsScript.XML_Service.Element[];
  getChildren(name: string): GoogleAppsScript.XML_Service.Element[];
  getChildren(
    name: string,
    namespace: GoogleAppsScript.XML_Service.Namespace
  ): GoogleAppsScript.XML_Service.Element[];

  getChildren(
    ...args:
      | []
      | [name: string]
      | [name: string, namespace: GoogleAppsScript.XML_Service.Namespace]
  ): GoogleAppsScript.XML_Service.Element[] {
    if (args.length === 0) {
      return this._contents.getAllElements();
    }

    if (args.length === 1 && typeof args[0] === "string") {
      const [name] = args;
      return this._contents.getElements(name, FakeNamespace.NO_NAMESPACE);
    }

    if (
      args.length === 2 &&
      typeof args[0] === "string" &&
      args[1] instanceof FakeNamespace
    ) {
      const [name, namespace] = args;
      return this._contents.getElements(name, namespace);
    }

    throw new ParameterMismatchException("FakeElement.getChildren", args);
  }

  getContent(
    index: GoogleAppsScript.Integer
  ): GoogleAppsScript.XML_Service.Content | null {
    if (typeof index !== "number") {
      throw new ParameterMismatchException("FakeElement.getContent", [index]);
    }

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
      return this._contents.removeAllContents();
    }

    if (args.length === 1 && GasTypes.isContent(args[0])) {
      const [content] = args;
      return this._contents.removeContent(content);
    }

    if (args.length === 1 && typeof args[0] === "number") {
      const [index] = args;
      return this._contents.removeContentAt(index);
    }

    throw new ParameterMismatchException("FakeElement.removeContent", args);
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

  getAttribute(name: string): GoogleAppsScript.XML_Service.Attribute | null;
  getAttribute(
    name: string,
    namespace: GoogleAppsScript.XML_Service.Namespace
  ): GoogleAppsScript.XML_Service.Attribute | null;

  getAttribute(
    ...args:
      | [name: string]
      | [name: string, namespace: GoogleAppsScript.XML_Service.Namespace]
  ): GoogleAppsScript.XML_Service.Attribute | null {
    if (args.length === 1 && typeof args[0] === "string") {
      const [name] = args;
      return this._attrs.get(name, FakeNamespace.NO_NAMESPACE);
    }

    if (
      args.length === 2 &&
      typeof args[0] === "string" &&
      args[1] instanceof FakeNamespace
    ) {
      const [name, namespace] = args;
      return this._attrs.get(name, namespace);
    }

    throw new ParameterMismatchException("FakeElement.getAttribute", args);
  }

  getAttributes(): GoogleAppsScript.XML_Service.Attribute[] {
    return this._attrs.getAll();
  }

  setAttribute(
    attribute: GoogleAppsScript.XML_Service.Attribute
  ): GoogleAppsScript.XML_Service.Element;
  setAttribute(
    name: string,
    value: string
  ): GoogleAppsScript.XML_Service.Element;
  setAttribute(
    name: string,
    value: string,
    namespace: GoogleAppsScript.XML_Service.Namespace
  ): GoogleAppsScript.XML_Service.Element;

  setAttribute(
    ...args:
      | [attribute: GoogleAppsScript.XML_Service.Attribute]
      | [name: string, value: string]
      | [
          name: string,
          value: string,
          namespace: GoogleAppsScript.XML_Service.Namespace
        ]
  ): GoogleAppsScript.XML_Service.Element {
    if (args.length === 1 && args[0] instanceof FakeAttribute) {
      const [attribute] = args;
      this._attrs.set(attribute);
      return this;
    }

    if (
      args.length === 2 &&
      typeof args[0] === "string" &&
      typeof args[1] === "string"
    ) {
      const [name, value] = args;
      const attr = new FakeAttribute(name, FakeNamespace.NO_NAMESPACE, value);
      this._attrs.set(attr);
      return this;
    }

    if (
      args.length === 3 &&
      typeof args[0] === "string" &&
      typeof args[1] === "string" &&
      args[2] instanceof FakeNamespace
    ) {
      const [name, value, namespace] = args;
      const attr = new FakeAttribute(name, namespace, value);
      this._attrs.set(attr);

      return this;
    }

    throw new ParameterMismatchException("FakeElement.setAttribute", args);
  }

  removeAttribute(attribute: GoogleAppsScript.XML_Service.Attribute): boolean;
  removeAttribute(attributeName: string): boolean;
  removeAttribute(
    attributeName: string,
    namespace: GoogleAppsScript.XML_Service.Namespace
  ): boolean;

  removeAttribute(
    ...args:
      | [attribute: GoogleAppsScript.XML_Service.Attribute]
      | [attributeName: string]
      | [
          attributeName: string,
          namespace: GoogleAppsScript.XML_Service.Namespace
        ]
  ): boolean {
    if (args.length === 1 && args[0] instanceof FakeAttribute) {
      const [attribute] = args;
      return this._attrs.remove(attribute);
    }

    if (args.length === 1 && typeof args[0] === "string") {
      const [attributeName] = args;
      return this._attrs.removeByName(
        attributeName,
        FakeNamespace.NO_NAMESPACE
      );
    }

    if (
      args.length === 2 &&
      typeof args[0] === "string" &&
      args[1] instanceof FakeNamespace
    ) {
      const [attributeName, namespace] = args;
      return this._attrs.removeByName(attributeName, namespace);
    }

    throw new ParameterMismatchException("FakeElement.removeAttribute", args);
  }

  getText(): string {
    return this._contents
      .getAllContents()
      .filter(
        (content) => content instanceof FakeCdata || content instanceof FakeText
      )
      .map((content) => content.getText())
      .join("");
  }

  setText(text: string): FakeElement {
    Guards.requireString(text, "text");
    this._contents.removeAllContents();
    this._contents.appendContent(new FakeText(text), "content");
    return this;
  }

  getDocument(): GoogleAppsScript.XML_Service.Document | null {
    const parent = this._getParent();
    return GasTypes.isDocument(parent) ? parent : null;
  }

  isAncestorOf(other: GoogleAppsScript.XML_Service.Element): boolean {
    if (!(other instanceof FakeElement)) {
      throw new ParameterMismatchException("FakeElement.isAncestorOf", [other]);
    }
    let current: ContentHolder | null = other;
    while (current instanceof FakeElement) {
      current = current._getParent();
      if (current === this) {
        return true;
      }
    }
    return false;
  }

  isRootElement(): boolean {
    return this.getDocument() !== null;
  }

  override asElement(): FakeElement {
    return this;
  }

  getType(): GoogleAppsScript.XML_Service.ContentType {
    return FakeContentTypes.ELEMENT;
  }

  override getValue(): string {
    return this._contents
      .getAllContents()
      .filter(
        (content) =>
          content instanceof FakeElement ||
          content instanceof FakeCdata ||
          content instanceof FakeText
      )
      .map((content) => content.getValue())
      .join("");
  }

  override _clone(): FakeElement {
    const element = new FakeElement(this._name, this._namespace);
    element._contents = this._contents.clone(element);
    element._attrs = this._attrs.clone(element);
    return element;
  }

  /**
   * Get the attribute list of this element.
   * @returns The attribute list of this element.
   * @internal
   */
  _getAttrs(): FakeAttributeList {
    return this._attrs;
  }

  override toString(): string {
    return `[FakeElement: ${this.getQualifiedName()}]`;
  }
}
