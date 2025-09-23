import { Guards } from "./internal/Guards";

/**
 * A fake implementation of the Namespace interface.
 */
export class FakeNamespace implements GoogleAppsScript.XML_Service.Namespace {
  /** The no-namespace instance. */
  static readonly NO_NAMESPACE = new FakeNamespace("", "");
  /** The XML namespace. */
  static readonly XML_NAMESPACE = new FakeNamespace(
    "xml",
    "http://www.w3.org/XML/1998/namespace"
  );

  /** The prefix of the namespace. */
  private readonly _prefix: string;
  /** The URI of the namespace. */
  private readonly _uri: string;

  /**
   * Creates a new FakeNamespace.
   * @param prefix The prefix of the namespace.
   * @param uri The URI of the namespace.
   */
  constructor(prefix: string, uri: string) {
    this._uri = Guards.requireString(uri, "uri");
    this._prefix = Guards.requireValidPrefix(prefix, uri);
  }

  getPrefix(): string {
    return this._prefix;
  }

  getURI(): string {
    return this._uri;
  }

  toString(): string {
    return `[Namespace: prefix "${this._prefix}" is mapped to URI "${this._uri}"]`;
  }
}
