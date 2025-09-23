import { NameConflictException } from "../../src/errors/NameConflictException";

describe("NameConflictException", () => {
  describe("constructor", () => {
    it("should set the name property to Exception", () => {
      // Arrange
      const ns = {
        getPrefix: () => "p",
        getURI: () => "http://www.example.com/uri",
        toString: () => "Namespace[p:uri]",
      } as GoogleAppsScript.XML_Service.Namespace;
      // Act
      const e = new NameConflictException(ns);
      // Assert
      expect(e.name).toBe("Exception");
    });

    it("should format the message as namespace conflict when name is undefined", () => {
      // Arrange
      const ns = {
        getPrefix: () => "p",
        getURI: () => "http://www.example.com/uri",
        toString: () => "Namespace[p:uri]",
      } as GoogleAppsScript.XML_Service.Namespace;
      // Act
      const e = new NameConflictException(ns);
      // Assert
      expect(e.message).toBe("namespace conflict: Namespace[p:uri]");
    });

    it("should format the message as name conflict when name is provided", () => {
      // Arrange
      const ns = {
        getPrefix: () => "p",
        getURI: () => "http://www.example.com/uri",
        toString: () => "Namespace[p:uri]",
      } as GoogleAppsScript.XML_Service.Namespace;
      // Act
      const e = new NameConflictException(ns, "foo");
      // Assert
      expect(e.message).toBe("name conflict: foo Namespace[p:uri]");
    });

    it("should be an instance of Error", () => {
      // Arrange
      const ns = {
        getPrefix: () => "p",
        getURI: () => "http://www.example.com/uri",
        toString: () => "Namespace[p:uri]",
      } as GoogleAppsScript.XML_Service.Namespace;
      // Act
      const e = new NameConflictException(ns, "foo");
      // Assert
      expect(e instanceof Error).toBe(true);
    });
  });
});
