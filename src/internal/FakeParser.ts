import * as xmldom from "@xmldom/xmldom";
import { Guards } from "./Guards";
import { XmldomToFakeConverter } from "./XmldomToFakeConverter";
import { FakeDocument } from "../FakeDocument";

/**
 * A parser that converts XML strings into FakeDocument instances using xmldom.
 */
export class FakeParser {
  /**
   * Parses an XML string into a FakeDocument.
   * @param xml The XML string to parse.
   * @returns The parsed FakeDocument.
   */
  parse(xml: string): FakeDocument {
    Guards.requireString(xml, "xml");
    const parser = new xmldom.DOMParser();
    const doc = parser.parseFromString(xml, "text/xml");
    return new XmldomToFakeConverter().convert(doc);
  }
}
