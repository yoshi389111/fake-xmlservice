import { ParameterMismatchException } from "./errors/ParameterMismatchException";
import { FakeCdata } from "./FakeCdata";
import { FakeComment } from "./FakeComment";
import { FakeDocType } from "./FakeDocType";
import { FakeDocument } from "./FakeDocument";
import { FakeElement } from "./FakeElement";
import { FakeFormat } from "./FakeFormat";
import { FakeNamespace } from "./FakeNamespace";
import { FakeText } from "./FakeText";
import { FakeContentTypes } from "./internal/FakeContentTypes";
import { FakeParser } from "./internal/FakeParser";

/**
 * A fake implementation of the XmlService.
 */
export class FakeXmlService implements GoogleAppsScript.XML_Service.XmlService {
  readonly ContentTypes = FakeContentTypes;

  createCdata(text: string): FakeCdata {
    return new FakeCdata(text);
  }

  createComment(text: string): FakeComment {
    return new FakeComment(text);
  }

  createDocType(elementName: string): FakeDocType;
  createDocType(elementName: string, systemId: string): FakeDocType;
  createDocType(
    elementName: string,
    publicId: string,
    systemId: string
  ): FakeDocType;

  createDocType(
    ...args:
      | [elementName: string]
      | [elementName: string, systemId: string]
      | [elementName: string, publicId: string, systemId: string]
  ): FakeDocType {
    if (args.length === 1 && typeof args[0] === "string") {
      const [elementName] = args;
      return new FakeDocType(elementName, null, null, null);
    }

    if (
      args.length === 2 &&
      typeof args[0] === "string" &&
      typeof args[1] === "string"
    ) {
      const [elementName, systemId] = args;
      return new FakeDocType(elementName, null, systemId, null);
    }

    if (
      args.length === 3 &&
      typeof args[0] === "string" &&
      typeof args[1] === "string" &&
      typeof args[2] === "string"
    ) {
      const [elementName, publicId, systemId] = args;
      return new FakeDocType(elementName, publicId, systemId, null);
    }

    throw new ParameterMismatchException("FakeXmlService.createDocType", args);
  }

  createDocument(): FakeDocument;
  createDocument(
    rootElement: GoogleAppsScript.XML_Service.Element
  ): FakeDocument;

  createDocument(
    ...args: [] | [GoogleAppsScript.XML_Service.Element]
  ): FakeDocument {
    if (args.length === 0) {
      return new FakeDocument();
    }

    if (args.length === 1 && args[0] instanceof FakeElement) {
      const [rootElement] = args;
      return new FakeDocument().addContent(rootElement);
    }

    throw new ParameterMismatchException("FakeXmlService.createDocument", args);
  }

  createElement(name: string): FakeElement;
  createElement(
    name: string,
    namespace: GoogleAppsScript.XML_Service.Namespace
  ): FakeElement;

  createElement(
    ...args: [string] | [string, GoogleAppsScript.XML_Service.Namespace]
  ): FakeElement {
    if (args.length === 1 && typeof args[0] === "string") {
      const [name] = args;
      return new FakeElement(name, FakeNamespace.NO_NAMESPACE);
    }

    if (
      args.length === 2 &&
      typeof args[0] === "string" &&
      args[1] instanceof FakeNamespace
    ) {
      const [name, namespace] = args;
      return new FakeElement(name, namespace);
    }

    throw new ParameterMismatchException("FakeXmlService.createElement", args);
  }

  createText(text: string): FakeText {
    return new FakeText(text);
  }

  getCompactFormat(): FakeFormat {
    return new FakeFormat().setIndent(null);
  }

  getPrettyFormat(): FakeFormat {
    return new FakeFormat();
  }

  getRawFormat(): FakeFormat {
    return new FakeFormat()._setCompactMode(false).setIndent(null);
  }

  getNamespace(uri: string): FakeNamespace;
  getNamespace(prefix: string, uri: string): FakeNamespace;

  getNamespace(
    ...args: [uri: string] | [prefix: string, uri: string]
  ): FakeNamespace {
    if (args.length === 1 && typeof args[0] === "string") {
      const [uri] = args;
      return new FakeNamespace("", uri);
    }

    if (
      args.length === 2 &&
      typeof args[0] === "string" &&
      typeof args[1] === "string"
    ) {
      const [prefix, uri] = args;
      return new FakeNamespace(prefix, uri);
    }

    throw new ParameterMismatchException("FakeXmlService.getNamespace", args);
  }

  getNoNamespace(): FakeNamespace {
    return FakeNamespace.NO_NAMESPACE;
  }

  getXmlNamespace(): FakeNamespace {
    return FakeNamespace.XML_NAMESPACE;
  }

  parse(xml: string): FakeDocument {
    return new FakeParser().parse(xml);
  }
}
