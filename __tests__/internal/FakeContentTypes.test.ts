import { FakeContentTypes } from "../../src/internal/FakeContentTypes";

describe("FakeContentTypes", () => {
  describe("toString", () => {
    it("should have toString() returning key name", () => {
      // Act & Assert
      expect(FakeContentTypes.CDATA.toString()).toBe("CDATA");
      expect(FakeContentTypes.COMMENT.toString()).toBe("COMMENT");
      expect(FakeContentTypes.DOCTYPE.toString()).toBe("DOCTYPE");
      expect(FakeContentTypes.ELEMENT.toString()).toBe("ELEMENT");
      expect(FakeContentTypes.ENTITYREF.toString()).toBe("ENTITYREF");
      expect(FakeContentTypes.PROCESSINGINSTRUCTION.toString()).toBe(
        "PROCESSINGINSTRUCTION"
      );
      expect(FakeContentTypes.TEXT.toString()).toBe("TEXT");
    });
  });

  describe("toJSON", () => {
    it("should have toJSON() returning key name", () => {
      // Act & Assert
      expect(JSON.stringify(FakeContentTypes.CDATA)).toBe('"CDATA"');
      expect(JSON.stringify(FakeContentTypes.COMMENT)).toBe('"COMMENT"');
      expect(JSON.stringify(FakeContentTypes.DOCTYPE)).toBe('"DOCTYPE"');
      expect(JSON.stringify(FakeContentTypes.ELEMENT)).toBe('"ELEMENT"');
      expect(JSON.stringify(FakeContentTypes.ENTITYREF)).toBe('"ENTITYREF"');
      expect(JSON.stringify(FakeContentTypes.PROCESSINGINSTRUCTION)).toBe(
        '"PROCESSINGINSTRUCTION"'
      );
      expect(JSON.stringify(FakeContentTypes.TEXT)).toBe('"TEXT"');
    });
  });

  it("should be equal to itself", () => {
    // Act & Assert
    expect(FakeContentTypes.CDATA === FakeContentTypes.CDATA).toBe(true);
    expect(FakeContentTypes.COMMENT === FakeContentTypes.COMMENT).toBe(true);
    expect(FakeContentTypes.DOCTYPE === FakeContentTypes.DOCTYPE).toBe(true);
    expect(FakeContentTypes.ELEMENT === FakeContentTypes.ELEMENT).toBe(true);
    expect(FakeContentTypes.ENTITYREF === FakeContentTypes.ENTITYREF).toBe(
      true
    );
    expect(
      FakeContentTypes.PROCESSINGINSTRUCTION ===
        FakeContentTypes.PROCESSINGINSTRUCTION
    ).toBe(true);
    expect(FakeContentTypes.TEXT === FakeContentTypes.TEXT).toBe(true);
  });

  it("should not be equal to other enums", () => {
    // Arrange
    const enums = [
      FakeContentTypes.CDATA,
      FakeContentTypes.COMMENT,
      FakeContentTypes.DOCTYPE,
      FakeContentTypes.ELEMENT,
      FakeContentTypes.ENTITYREF,
      FakeContentTypes.PROCESSINGINSTRUCTION,
      FakeContentTypes.TEXT,
    ];
    // Act & Assert
    expect(new Set(enums).size).toBe(enums.length);
  });

  it("should be immutable", () => {
    // Act & Assert
    expect(() => {
      // @ts-expect-error
      FakeContentTypes.NEW_PROP = 123;
    }).toThrow('Property "NEW_PROP" is immutable and cannot be changed');

    // Act & Assert
    expect(() => {
      // @ts-expect-error
      delete FakeContentTypes.TEXT;
    }).toThrow('Property "TEXT" cannot be deleted');

    // Act & Assert
    expect(() => {
      Object.defineProperty(FakeContentTypes, "TEXT", {
        value: 999,
      });
    }).toThrow('Property "TEXT" cannot be redefined');
  });
});
