import "../src/index";

describe("index.ts", () => {
  it("should define XmlService on globalThis", () => {
    expect(globalThis.XmlService).toBeDefined();
    expect(typeof globalThis.XmlService).toBe("object");
    expect(globalThis.XmlService.constructor.name).toBe("FakeXmlService");
  });
});
