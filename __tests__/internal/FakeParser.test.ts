import { FakeParser } from "../../src/internal/FakeParser";

describe("FakeParser", () => {
  describe("parse", () => {
    it("should parse an XML string", () => {
      // Arrange
      const xml = `<root><child> abc </child></root>`;
      const parser = new FakeParser();
      // Act
      const doc = parser.parse(xml);
      // Assert
      const root = doc.getRootElement()!;
      expect(root).not.toBeNull();
      expect(root.getName()).toBe("root");
      expect(root.getChildren("child")[0].getText()).toBe(" abc ");
    });
  });
});
