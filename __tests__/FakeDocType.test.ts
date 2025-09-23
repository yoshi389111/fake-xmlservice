import { FakeDocType } from "../src/FakeDocType";

describe("FakeDocType", () => {
  describe("constructor", () => {
    it("should construct with initial values", () => {
      // Act
      const docType = new FakeDocType(
        "root",
        "PUBLIC_ID",
        "SYSTEM_ID",
        "INTERNAL_SUBSET"
      );
      // Assert
      expect(docType.getElementName()).toBe("root");
      expect(docType.getPublicId()).toBe("PUBLIC_ID");
      expect(docType.getSystemId()).toBe("SYSTEM_ID");
      expect(docType.getInternalSubset()).toBe("INTERNAL_SUBSET");
    });

    it("should construct with null values", () => {
      // Act
      const docType = new FakeDocType("root", null, null, null);
      // Assert
      expect(docType.getElementName()).toBe("root");
      expect(docType.getPublicId()).toBeNull();
      expect(docType.getSystemId()).toBeNull();
      expect(docType.getInternalSubset()).toBeNull();
    });

    it("should throw error for non-string name", () => {
      // Act & Assert
      expect(() => {
        // @ts-expect-error
        new FakeDocType(123, null, null, null);
      }).toThrow(/invalid argument: name/);

      // Act & Assert
      expect(() => {
        // @ts-expect-error
        new FakeDocType("abc", 123, null, null);
      }).toThrow(/invalid argument: publicId/);

      // Act & Assert
      expect(() => {
        // @ts-expect-error
        new FakeDocType("abc", null, 123, null);
      }).toThrow(/invalid argument: systemId/);

      // Act & Assert
      expect(() => {
        // @ts-expect-error
        new FakeDocType("abc", null, null, 123);
      }).toThrow(/invalid argument: internalSubset/);
    });
  });

  describe("setElementName and getElementName", () => {
    it("should set and get element name", () => {
      // Arrange
      const docType = new FakeDocType("a", null, null, null);
      // Act
      docType.setElementName("b");
      // Act & Assert
      expect(docType.getElementName()).toBe("b");
    });
  });

  describe("setPublicId and getPublicId", () => {
    it("should set and get publicId", () => {
      // Arrange
      const docType = new FakeDocType("a", null, null, null);
      // Act
      docType.setPublicId("PUB");
      // Act & Assert
      expect(docType.getPublicId()).toBe("PUB");

      // Act
      docType.setPublicId(null);
      // Act & Assert
      expect(docType.getPublicId()).toBeNull();
    });
  });

  describe("setSystemId and getSystemId", () => {
    it("should set and get systemId", () => {
      // Arrange
      const docType = new FakeDocType("a", null, null, null);
      // Act
      docType.setSystemId("SYS");
      // Act & Assert
      expect(docType.getSystemId()).toBe("SYS");

      // Act
      docType.setSystemId(null);
      // Act & Assert
      expect(docType.getSystemId()).toBeNull();
    });
  });

  describe("setInternalSubset and getInternalSubset", () => {
    it("should set and get internalSubset", () => {
      // Arrange
      const docType = new FakeDocType("a", null, null, null);
      // Act
      docType.setInternalSubset("INT");
      // Act & Assert
      expect(docType.getInternalSubset()).toBe("INT");

      // Act
      docType.setInternalSubset(null);
      // Act & Assert
      expect(docType.getInternalSubset()).toBeNull();
    });
  });

  describe("getType", () => {
    it("should return correct type", () => {
      // Arrange
      const docType = new FakeDocType("a", null, null, null);
      // Act & Assert
      expect(docType.getType()).toBeDefined();
    });
  });

  describe("getName", () => {
    it("should return empty string for getValue", () => {
      // Arrange
      const docType = new FakeDocType("a", null, null, null);
      // Act & Assert
      expect(docType.getValue()).toBe("");
    });
  });

  describe("asDocType", () => {
    it("should return itself for asDocType", () => {
      // Arrange
      const docType = new FakeDocType("a", null, null, null);
      // Act & Assert
      expect(docType.asDocType()).toBe(docType);
    });
  });

  describe("_clone", () => {
    it("should clone itself", () => {
      // Arrange
      const docType = new FakeDocType("root", "PUB", "SYS", "INT");
      // Act
      const clone = docType._clone();
      // Assert
      expect(clone).not.toBe(docType);
      expect(clone.getElementName()).toBe("root");
      expect(clone.getPublicId()).toBe("PUB");
      expect(clone.getSystemId()).toBe("SYS");
      expect(clone.getInternalSubset()).toBe("INT");
    });
  });

  describe("toString", () => {
    it("should return a string representation", () => {
      // Arrange
      const docType = new FakeDocType("root", "PUB", "SYS", "INT");
      // Act & Assert
      expect(docType.toString()).toBe("[FakeDocType: root]");
    });
  });
});
