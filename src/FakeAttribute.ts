import { InvalidArgumentException } from "./errors/InvalidArgumentException";
import { NameConflictException } from "./errors/NameConflictException";
import { ParameterMismatchException } from "./errors/ParameterMismatchException";
import { FakeNamespace } from "./FakeNamespace";
import { AttributeOwner } from "./interfaces/AttributeOwner";
import { Guards } from "./internal/Guards";
import { NamespaceHelper } from "./internal/NamespaceHelper";

/**
 * A fake implementation of the Attribute interface.
 */
export class FakeAttribute implements GoogleAppsScript.XML_Service.Attribute {
  /** The owner of the attribute, or null if it has no owner. */
  private _owner: AttributeOwner | null = null;
  /** The namespace of the attribute. */
  private _namespace: GoogleAppsScript.XML_Service.Namespace =
    FakeNamespace.NO_NAMESPACE;
  /** The name of the attribute. */
  private _name: string;
  /** The value of the attribute. */
  private _value: string;

  /**
   * Creates a new FakeAttribute.
   * @param name The name of the attribute.
   * @param namespace The namespace of the attribute.
   * @param value The value of the attribute.
   */
  constructor(
    name: string,
    namespace: GoogleAppsScript.XML_Service.Namespace,
    value: string
  ) {
    this._name = Guards.requireValidXmlName(name, "name");
    this._value = Guards.requireString(value, "value");

    this.setNamespace(namespace);
  }

  getName(): string {
    return this._name;
  }

  setName(name: string): FakeAttribute {
    Guards.requireValidXmlName(name, "name");
    if (this._owner && !this._owner._getAttrs().canChangeName(this, name)) {
      throw new NameConflictException(this._namespace, name);
    }
    this._name = name;
    return this;
  }

  getNamespace(): GoogleAppsScript.XML_Service.Namespace {
    return this._namespace;
  }

  setNamespace(
    namespace: GoogleAppsScript.XML_Service.Namespace
  ): FakeAttribute {
    if (!(namespace instanceof FakeNamespace)) {
      throw new ParameterMismatchException("FakeAttribute.setNamespace", [
        namespace,
      ]);
    }
    if (NamespaceHelper.isDefault(namespace)) {
      throw new InvalidArgumentException(
        "namespace",
        "default namespace not allowed"
      );
    }
    if (
      this._owner &&
      !this._owner._getAttrs().canChangeNamespace(this, namespace)
    ) {
      throw new NameConflictException(namespace, this._name);
    }

    this._namespace = namespace;
    return this;
  }

  /**
   * Get the qualified name of the attribute, including the prefix if present.
   * @returns The qualified name of the attribute.
   * @internal
   */
  _getQualifiedName(): string {
    const prefix = this.getNamespace().getPrefix();
    return prefix ? `${prefix}:${this.getName()}` : this.getName();
  }

  getValue(): string {
    return this._value;
  }

  setValue(value: string): FakeAttribute {
    this._value = Guards.requireString(value, "value");
    return this;
  }

  /**
   * Get the owner of the attribute.
   * @returns The owner of the attribute, or null if it has no owner.
   * @internal
   */
  _getOwner(): AttributeOwner | null {
    return this._owner;
  }

  /**
   * Set the owner of the attribute.
   * @param owner The owner to set, or null to remove the owner.
   * @internal
   */
  _setOwner(owner: AttributeOwner | null): void {
    this._owner = owner;
  }

  /**
   * Get a clone of the attribute.
   * @returns A clone of the attribute.
   * @internal
   */
  _clone(): FakeAttribute {
    return new FakeAttribute(this._name, this._namespace, this._value);
  }

  toString(): string {
    return `[FakeAttribute: ${this._getQualifiedName()}="${this._value}"]`;
  }
}
