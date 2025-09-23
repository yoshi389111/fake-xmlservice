import { AbstractFakeContent } from "../../src/AbstractFakeContent";
import { FakeDocument } from "../../src/FakeDocument";
import { FakeElement } from "../../src/FakeElement";
import { FakeNamespace } from "../../src/FakeNamespace";
import { FakeText } from "../../src/FakeText";
import { FakeContentTypes } from "../../src/internal/FakeContentTypes";
import { GasTypes } from "../../src/internal/GasTypes";

class DummyContent extends AbstractFakeContent {
  override getType(): GoogleAppsScript.XML_Service.ContentType {
    return FakeContentTypes.TEXT;
  }

  override getValue(): string {
    return "dummy text";
  }

  override _clone(): AbstractFakeContent {
    return new DummyContent();
  }
}

describe("GasTypes", () => {
  describe("isDocument", () => {
    it("should return true for object with getRootElement", () => {
      expect(GasTypes.isDocument(new FakeDocument())).toBe(true);
    });
    it("should return false for null/undefined", () => {
      expect(GasTypes.isDocument(null)).toBe(false);
      expect(GasTypes.isDocument(undefined)).toBe(false);
    });
    it("should return false for object without getRootElement", () => {
      expect(GasTypes.isDocument({})).toBe(false);
    });
  });

  describe("isContent", () => {
    const dummyObject = {
      asCdata: () => {},
      asComment: () => {},
      asDocType: () => {},
      asElement: () => {},
      asEntityRef: () => {},
      asProcessingInstruction: () => {},
      asText: () => {},
      detach: () => {},
      getParentElement: () => {},
      getType: () => FakeContentTypes.ELEMENT,
      getValue: () => {},
    };
    it("should return true when content is a AbstractFakeContent instance", () => {
      expect(GasTypes.isContent(new DummyContent())).toBe(true);
    });
    it("should return false for object with all required methods", () => {
      expect(GasTypes.isContent(dummyObject)).toBe(false);
    });
    it("should return false for null/undefined", () => {
      expect(GasTypes.isContent(null)).toBe(false);
      expect(GasTypes.isContent(undefined)).toBe(false);
    });
  });

  describe("isElement", () => {
    it("should return true for Content with getType() === ELEMENT", () => {
      expect(
        GasTypes.isElement(new FakeElement("root", FakeNamespace.NO_NAMESPACE))
      ).toBe(true);
    });
    it("should return false for Content with getType() !== ELEMENT", () => {
      expect(GasTypes.isElement(new FakeText("text"))).toBe(false);
    });
    it("should return false for non-Content", () => {
      expect(GasTypes.isElement({})).toBe(false);
    });
  });
});
