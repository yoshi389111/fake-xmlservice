import { AbstractFakeContent } from "./AbstractFakeContent";
import { FakeContentTypes } from "./internal/FakeContentTypes";
import { Guards } from "./internal/Guards";

/**
 * A fake implementation of the DocType interface.
 */
export class FakeDocType
  extends AbstractFakeContent
  implements GoogleAppsScript.XML_Service.DocType
{
  /** The name of the document type. */
  private _name: string;
  /** The public identifier of the document type. */
  private _publicId: string | null;
  /** The system identifier of the document type. */
  private _systemId: string | null;
  /** The internal subset of the document type. */
  private _internalSubset: string | null;

  /**
   * Creates a new FakeDocType.
   * @param name The name of the document type.
   * @param publicId The public identifier of the document type.
   * @param systemId The system identifier of the document type.
   * @param internalSubset The internal subset of the document type.
   */
  constructor(
    name: string,
    publicId: string | null,
    systemId: string | null,
    internalSubset: string | null
  ) {
    super();
    this._name = Guards.requireString(name, "name");
    this._publicId =
      publicId === null ? null : Guards.requireString(publicId, "publicId");
    this._systemId =
      systemId === null ? null : Guards.requireString(systemId, "systemId");
    this._internalSubset =
      internalSubset === null
        ? null
        : Guards.requireString(internalSubset, "internalSubset");
  }

  getElementName(): string {
    return this._name;
  }

  setElementName(name: string): FakeDocType {
    this._name = Guards.requireString(name, "name");
    return this;
  }

  getPublicId(): string | null {
    return this._publicId;
  }

  setPublicId(id: string | null): FakeDocType {
    this._publicId = id === null ? null : Guards.requireString(id, "id");
    return this;
  }

  getSystemId(): string | null {
    return this._systemId;
  }

  setSystemId(id: string | null): FakeDocType {
    this._systemId = id === null ? null : Guards.requireString(id, "id");
    return this;
  }

  getInternalSubset(): string | null {
    return this._internalSubset;
  }

  setInternalSubset(data: string | null): FakeDocType {
    this._internalSubset =
      data === null ? null : Guards.requireString(data, "data");
    return this;
  }

  getType(): GoogleAppsScript.XML_Service.ContentType {
    return FakeContentTypes.DOCTYPE;
  }

  override getValue(): string {
    return "";
  }

  override asDocType(): FakeDocType {
    return this;
  }

  override _clone(): FakeDocType {
    return new FakeDocType(
      this._name,
      this._publicId,
      this._systemId,
      this._internalSubset
    );
  }

  override toString(): string {
    return `[FakeDocType: ${this._name}]`;
  }
}
