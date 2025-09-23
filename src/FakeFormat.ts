import * as xmldom from "@xmldom/xmldom";
import formatXml from "xml-formatter";
import { ParameterMismatchException } from "./errors/ParameterMismatchException";
import { FakeDocument } from "./FakeDocument";
import { FakeElement } from "./FakeElement";
import { FakeToXmldomConverter } from "./internal/FakeToXmldomConverter";
import { Guards } from "./internal/Guards";

/**
 * A fake implementation of the Format interface.
 */
export class FakeFormat implements GoogleAppsScript.XML_Service.Format {
  /** The character encoding to use. Default is "UTF-8". */
  private _encoding = "UTF-8";
  /** The string to use for indentation. Default is two spaces. Set to null for no indentation. */
  private _indent: string | null = "  ";
  /** The line separator to use. Default is "\r\n". */
  private _separator = "\r\n";
  /** Whether to omit the XML declaration. Default is false. */
  private _omitDeclaration = false;
  /** Whether to omit the encoding in the XML declaration. Default is false. */
  private _omitEncoding = false;
  /** Whether to use compact mode. Default is true. */
  private _compactMode = true;

  setEncoding(encoding: string): FakeFormat {
    this._encoding = Guards.requireString(encoding, "encoding");
    return this;
  }

  /**
   * Get the current encoding.
   * @returns The current encoding.
   * @internal
   */
  _getEncoding(): string {
    return this._encoding;
  }

  setIndent(indent: string | null): FakeFormat {
    this._indent =
      indent == null ? null : Guards.requireString(indent, "indent");
    return this;
  }

  /**
   * Get the current indent string.
   * @returns The current indent string, or null if no indentation is set.
   * @internal
   */
  _getIndent(): string | null {
    return this._indent;
  }

  setLineSeparator(separator: string): FakeFormat {
    this._separator = Guards.requireString(separator, "separator");
    return this;
  }

  /**
   * Get the current line separator.
   * @returns The current line separator.
   * @internal
   */
  _getLineSeparator(): string {
    return this._separator;
  }

  setOmitDeclaration(omitDeclaration: boolean): FakeFormat {
    this._omitDeclaration = Guards.requireBoolean(
      omitDeclaration,
      "omitDeclaration"
    );
    return this;
  }

  /**
   * Get the current omit declaration flag.
   * @returns The current omit declaration flag.
   * @internal
   */
  _getOmitDeclaration(): boolean {
    return this._omitDeclaration;
  }

  setOmitEncoding(omitEncoding: boolean): FakeFormat {
    this._omitEncoding = Guards.requireBoolean(omitEncoding, "omitEncoding");
    return this;
  }

  /**
   * Get the current omit encoding flag.
   * @returns The current omit encoding flag.
   * @internal
   */
  _getOmitEncoding(): boolean {
    return this._omitEncoding;
  }

  /**
   * Set the compact mode.
   * @param compactMode Whether to use compact mode, which minimizes whitespace in the output. Default is true.
   * @returns The current FakeFormat instance.
   * @internal
   */
  _setCompactMode(compactMode: boolean): FakeFormat {
    this._compactMode = compactMode;
    return this;
  }

  /**
   * Get the current compact mode flag.
   * @returns The current compact mode flag.
   * @internal
   */
  _getCompactMode(): boolean {
    return this._compactMode;
  }

  format(document: GoogleAppsScript.XML_Service.Document): string;
  format(element: GoogleAppsScript.XML_Service.Element): string;

  format(
    ...args:
      | [document: GoogleAppsScript.XML_Service.Document]
      | [element: GoogleAppsScript.XML_Service.Element]
  ): string {
    if (args.length === 1 && args[0] instanceof FakeDocument) {
      const [document] = args;
      return this._formatDocument(document);
    }

    if (args.length === 1 && args[0] instanceof FakeElement) {
      const [element] = args;
      return this._formatElement(element);
    }

    throw new ParameterMismatchException("FakeFormat.format", args);
  }

  /**
   * Format the given document.
   * @param document The document to format.
   * @returns The formatted document as a string.
   */
  private _formatDocument(document: FakeDocument): string {
    const converter = new FakeToXmldomConverter(this._compactMode);
    const doc = converter.convertDocument(document);
    const xml = new xmldom.XMLSerializer().serializeToString(doc);
    const formatedXml = this._formatXml(xml);
    const encoding = this._omitEncoding ? "" : ` encoding="${this._encoding}"`;
    const xmlDefine = this._omitDeclaration
      ? ""
      : `<?xml version="1.0"${encoding}?>${this._separator}`;

    return xmlDefine + formatedXml;
  }

  /**
   * Format the given element.
   * @param element The element to format.
   * @returns The formatted element as a string.
   */
  private _formatElement(element: FakeElement): string {
    const converter = new FakeToXmldomConverter(this._compactMode);
    const el = converter.convertElement(element);
    const xml = new xmldom.XMLSerializer().serializeToString(el);
    return this._formatXml(xml);
  }

  /**
   * Format the given XML string.
   * @param xml The XML string to format.
   * @returns The formatted XML string.
   */
  private _formatXml(xml: string): string {
    return formatXml(xml, {
      indentation: this._indent || "",
      lineSeparator: this._indent === null ? "" : this._separator,
    });
  }
}
