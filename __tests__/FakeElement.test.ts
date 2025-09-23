import { FakeAttribute } from "../src/FakeAttribute";
import { FakeCdata } from "../src/FakeCdata";
import { FakeDocType } from "../src/FakeDocType";
import { FakeDocument } from "../src/FakeDocument";
import { FakeElement } from "../src/FakeElement";
import { FakeNamespace } from "../src/FakeNamespace";
import { FakeText } from "../src/FakeText";
import { FakeContentTypes } from "../src/internal/FakeContentTypes";

const NO_NAMESPACE = FakeNamespace.NO_NAMESPACE;

describe("FakeElement", () => {
  describe("constructor", () => {
    it("should create an instance with name only", () => {
      // Act
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Assert
      expect(el.getName()).toBe("foo");
      expect(el.getNamespace()).toBe(NO_NAMESPACE);
    });

    it("should create an instance with name and namespace", () => {
      // Arrange
      const ns = new FakeNamespace("p", "http://www.example.com/uri");
      // Act
      const el = new FakeElement("foo", ns);
      // Assert
      expect(el.getName()).toBe("foo");
      expect(el.getNamespace()).toBe(ns);
    });

    it("should throw if constructor with invalid xml name", () => {
      // Act & Assert
      expect(() => new FakeElement("xml", NO_NAMESPACE)).toThrow(
        /invalid argument: name/
      );
    });
  });

  describe("getName & setName", () => {
    it("should get and set name", () => {
      // Act & Assert
      const el = new FakeElement("foo", NO_NAMESPACE);
      expect(el.getName()).toBe("foo");
      el.setName("bar");
      expect(el.getName()).toBe("bar");
    });
  });

  describe("getNamespace", () => {
    it("should get namespace", () => {
      // Arrange
      const ns = new FakeNamespace("p", "http://www.example.com/uri");
      const ns2 = new FakeNamespace("v", "http://www.example.com/uri2");
      const el = new FakeElement("foo1", ns);
      const el1 = new FakeElement("foo2", ns);
      const el2 = new FakeElement("foo3", ns);
      el.setAttribute("attr", "value", ns2);
      el.addContent(el1);
      el1.addContent(el2);
      // Act & Assert
      expect(el2.getNamespace()).toBe(ns);
      expect(el2.getNamespace("p")).toBe(ns);
      expect(el2.getNamespace("v")).toBe(ns2);
      expect(el2.getNamespace("x")).toBe(null);
      expect(el2.getNamespace("")).toBe(null);

      // Arrange
      el1.setNamespace(NO_NAMESPACE);
      // Act & Assert
      expect(el1.getNamespace()).toBe(NO_NAMESPACE);
    });

    it("should throw if getNamespace with invalid argument", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act & Assert
      expect(() =>
        // @ts-expect-error
        el.getNamespace(123)
      ).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeElement\.getNamespace/
      );
    });
  });

  describe("setNamespace", () => {
    it("should set namespace", () => {
      // Arrange
      const ns = new FakeNamespace("p", "http://www.example.com/uri");
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act
      el.setNamespace(ns);
      // Assert
      expect(el.getNamespace()).toBe(ns);
    });

    it("should throw if setNamespace with invalid argument", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act & Assert
      expect(() =>
        // @ts-expect-error
        el.setNamespace("invalid")
      ).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeElement\.setNamespace/
      );
    });

    it("should setNamespace with prefix throws if there is an incompatible attribute", () => {
      // Arrange
      const ns1 = new FakeNamespace("p", "http://example.com/uri1");
      const ns2 = new FakeNamespace("p", "http://example.com/uri2");
      const el = new FakeElement("foo", NO_NAMESPACE);
      el.setAttribute("attr", "value", ns1);
      // Act & Assert
      expect(() => el.setNamespace(ns2)).toThrow(/namespace conflict:/);
    });
  });

  describe("getQualifiedName", () => {
    it("should get qualified name without prefix", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act & Assert
      expect(el.getQualifiedName()).toBe("foo");
    });

    it("should get qualified name with prefix", () => {
      // Arrange
      const ns = new FakeNamespace("p", "http://www.example.com/uri");
      const el = new FakeElement("foo", ns);
      // Act & Assert
      expect(el.getQualifiedName()).toBe("p:foo");
    });
  });

  describe("getContent", () => {
    it("should add and get content", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      const text = new FakeText("abc");
      el.addContent(text);
      expect(el.getContentSize()).toBe(1);
      // Act & Assert
      expect(el.getContent(0)).toBe(text);
      // Assert
      expect(el.getText()).toBe("abc");
    });

    it("should return null for getContent with out-of-bounds index", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act & Assert
      expect(el.getContent(0)).toBeNull();
      expect(el.getContent(-1)).toBeNull();
    });

    it("should throw if getContent with invalid argument", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act & Assert
      expect(() =>
        // @ts-expect-error
        el.getContent("invalid")
      ).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeElement\.getContent/
      );
    });
  });

  describe("addContent", () => {
    it("should add contents", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      const ns = new FakeNamespace("p", "http://www.example.com/uri");
      // Act
      el.addContent(new FakeElement("abc", ns));
      // Assert
      expect(el.getContentSize()).toBe(1);
      expect(el.getChildren()[0].getName()).toBe("abc");

      // Act
      el.addContent(new FakeElement("def", NO_NAMESPACE));
      // Assert
      expect(el.getContentSize()).toBe(2);
      expect(el.getChildren()[0].getName()).toBe("abc");
      expect(el.getChildren()[1].getName()).toBe("def");

      // Act
      el.addContent(1, new FakeElement("xyz", NO_NAMESPACE));
      // Assert
      expect(el.getContentSize()).toBe(3);
      expect(el.getChildren()[0].getName()).toBe("abc");
      expect(el.getChildren()[1].getName()).toBe("xyz");
      expect(el.getChildren()[2].getName()).toBe("def");
    });

    it("should throw an error if the arguments are invalid #1", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      const text = new FakeText("text");
      // Act & Assert
      expect(() =>
        // @ts-expect-error
        el.addContent(text, null, 3)
      ).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeElement\.addContent/
      );
    });

    it("should throw an error if the arguments are invalid #2", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act & Assert
      expect(() =>
        // @ts-expect-error
        el.addContent("invalid argument")
      ).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeElement\.addContent/
      );
    });

    it("should throw an error if it add an attached content", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      const text = new FakeText("text");
      text._setParent(el);
      // Act & Assert
      expect(() => el.addContent(text)).toThrow(/invalid argument: content/);
    });

    it("should throw if addContent with invalid index", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      const text = new FakeText("text");
      // Act & Assert
      expect(() => el.addContent(1, text)).toThrow(/invalid argument: index/);
    });

    it("should throw if addContent with too many arguments", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act & Assert
      expect(() =>
        // @ts-expect-error
        el.addContent(1, new FakeText("a"), 2)
      ).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeElement\.addContent/
      );
    });

    it("should throw if addContent when add an DocType", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      const docType = new FakeDocType("html", null, null, null);
      // Act & Assert
      expect(() => el.addContent(docType)).toThrow(/invalid argument: content/);
    });
  });

  describe("removeContent", () => {
    it("should remove all contents", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      const text1 = new FakeText("abc");
      const text2 = new FakeText("abc");
      el.addContent(text1);
      el.addContent(text2);
      // Act
      const removed = el.removeContent();
      // Assert
      expect(removed.length).toBe(2);
      expect(removed).toContain(text1);
      expect(removed).toContain(text2);
      expect(el.getContentSize()).toBe(0);
      expect(text1._getParent()).toBeNull();
      expect(text2._getParent()).toBeNull();
    });

    it("should remove content #1", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      const text = new FakeText("abc");
      el.addContent(text);
      // Act & Assert
      expect(el.removeContent(text)).toBe(true);
      // Assert
      expect(el.getContentSize()).toBe(0);
    });

    it("should return null if the content is not found", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      const text = new FakeText("abc");
      el.addContent(text);
      const text2 = new FakeText("abc2");
      // Act & Assert
      expect(el.removeContent(text2)).toBe(false);
      // Assert
      expect(el.getContentSize()).toBe(1);
    });

    it("should remove content #2", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      const text1 = new FakeText("abc");
      const text2 = new FakeText("abc");
      el.addContent(text1);
      el.addContent(text2);
      // Act
      const removed = el.removeContent(0);
      // Assert
      expect(removed).toBe(text1);
      expect(text1._getParent()).toBeNull();
      expect(el.getContentSize()).toBe(1);
      expect(el.getContent(0)).toBe(text2);
    });

    it("should return null if the index is invalid", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      const text1 = new FakeText("abc");
      const text2 = new FakeText("abc");
      el.addContent(text1);
      el.addContent(text2);
      // Act
      const removed = el.removeContent(-1);
      // Assert
      expect(removed).toBeNull();
      expect(el.getContentSize()).toBe(2);
      expect(el.getContent(0)).toBe(text1);
      expect(el.getContent(1)).toBe(text2);
    });

    it("should throw an error if the argument is invalid", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act & Assert
      expect(() =>
        // @ts-expect-error
        el.removeContent("invalid")
      ).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeElement\.removeContent/
      );
    });
  });

  describe("cloneContent", () => {
    it("should clone contents", () => {
      // Arrange
      const ns = new FakeNamespace("p", "http://www.example.com/uri");
      const el = new FakeElement("foo", ns);
      const child1 = new FakeElement("child1", ns);
      const child2 = new FakeElement("child2", ns);
      el.addContent(child1);
      el.addContent(child2);
      // Act
      const clonedChildren = el.cloneContent();
      // Assert
      expect(clonedChildren.length).toBe(2);
      expect(clonedChildren[0].getType()).toBe(FakeContentTypes.ELEMENT);
      expect(clonedChildren[0]).not.toBe(child1);
      expect((clonedChildren[0] as FakeElement).getName()).toBe(
        child1.getName()
      );
      expect(clonedChildren[1].getType()).toBe(FakeContentTypes.ELEMENT);
      expect(clonedChildren[1]).not.toBe(child2);
      expect((clonedChildren[1] as FakeElement).getName()).toBe(
        child2.getName()
      );
    });
  });

  describe("getChild", () => {
    it("should get child", () => {
      // Arrange
      const ns = new FakeNamespace("p", "http://www.example.com/uri");
      const el = new FakeElement("foo", NO_NAMESPACE);
      const child1 = new FakeElement("child", ns);
      const child2 = new FakeElement("child", NO_NAMESPACE);
      el.addContent(child1);
      el.addContent(child2);
      // Act & Assert
      expect(el.getChild("child")).toBe(child2);
    });

    it("should get child by namespace", () => {
      // Arrange
      const ns = new FakeNamespace("p", "http://www.example.com/uri");
      const el = new FakeElement("foo", NO_NAMESPACE);
      const child1 = new FakeElement("child", ns);
      const child2 = new FakeElement("child", NO_NAMESPACE);
      el.addContent(child1);
      el.addContent(child2);
      // Act & Assert
      expect(el.getChild("child")).toBe(child2);
    });

    it("should get child by namespace", () => {
      // Arrange
      const ns = new FakeNamespace("p", "http://www.example.com/uri");
      const el = new FakeElement("foo", NO_NAMESPACE);
      const child1 = new FakeElement("child", NO_NAMESPACE);
      const child2 = new FakeElement("child", ns);
      el.addContent(child1);
      el.addContent(child2);
      // Act & Assert
      expect(el.getChild("child", ns)).toBe(child2);
    });

    it("should getChild returns null if not found", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act & Assert
      expect(el.getChild("notfound")).toBeNull();
    });

    it("should throw error if the name is invalid", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act & Assert
      expect(() =>
        // @ts-expect-error
        el.getChild(123)
      ).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeElement\.getChild/
      );
    });

    it("should throw error if the arguments are invalid", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act & Assert
      expect(() =>
        // @ts-expect-error
        el.getChild("child", "invalid")
      ).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeElement\.getChild/
      );
    });
  });

  describe("getChildren", () => {
    it("should get children by name", () => {
      // Arrange
      const noNs = new FakeNamespace("", "");
      const ns = new FakeNamespace("p", "http://www.example.com/uri");
      const el = new FakeElement("root", NO_NAMESPACE);
      const child1 = new FakeElement("child", NO_NAMESPACE);
      const child2 = new FakeElement("child", noNs);
      const child3 = new FakeElement("child", ns);
      el.addContent(child1);
      el.addContent(child2);
      el.addContent(child3);
      // Act
      const children = el.getChildren("child");
      // Assert
      expect(children.length).toBe(2);
      expect(children[0]).toBe(child1);
      expect(children[1]).toBe(child2);
    });

    it("should get children by name and namespace", () => {
      // Arrange
      const ns = new FakeNamespace("p", "http://www.example.com/url");
      const ns2 = new FakeNamespace("p2", "http://www.example.com/uri2");
      const el = new FakeElement("root", ns);
      const child1 = new FakeElement("child", ns);
      const child2 = new FakeElement("child", ns);
      const child3 = new FakeElement("child", ns2);
      el.addContent(child1);
      el.addContent(child2);
      el.addContent(child3);
      // Act
      const children = el.getChildren("child", ns);
      // Assert
      expect(children.length).toBe(2);
      expect(children[0]).toBe(child1);
      expect(children[1]).toBe(child2);
    });

    it("should throw error if the arguments are invalid", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act & Assert
      expect(() =>
        // @ts-expect-error
        el.getChildren("child", NO_NAMESPACE, "invalid")
      ).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeElement\.getChildren/
      );
    });

    it("should getChildren with no args returns all children", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act & Assert
      expect(el.getChildren().length).toBe(0);

      // Arrange
      el.addContent(new FakeElement("bar", NO_NAMESPACE));
      // Act & Assert
      expect(el.getChildren().length).toBe(1);

      // Arrange
      el.addContent(new FakeElement("baz", NO_NAMESPACE));
      // Act & Assert
      expect(el.getChildren().length).toBe(2);
    });
  });

  describe("getDescendants", () => {
    it("should get descendants", () => {
      // Arrange
      const el = new FakeElement("root", NO_NAMESPACE);
      const child = new FakeElement("child", NO_NAMESPACE);
      el.addContent(child);
      const text = new FakeText("abc");
      child.addContent(text);
      // Act
      const descendants = el.getDescendants();
      // Assert
      expect(descendants.length).toBe(2);
      expect(descendants).toContain(child);
      expect(descendants).toContain(text);
    });

    it("should getDescendants returns empty if no children", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act & Assert
      expect(el.getDescendants()).toEqual([]);
    });
  });

  describe("getChildText", () => {
    it("should get a child text", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      const child = new FakeElement("abc", NO_NAMESPACE);
      child.addContent(new FakeText("def"));
      el.addContent(child);
      // Act & Assert
      expect(el.getChildText("abc")).toBe("def");
      expect(el.getChildText("xyz")).toBeNull();
    });

    it("should get a child text by namespace", () => {
      // Arrange
      const ns = new FakeNamespace("p", "http://www.example.com/uri");
      const el = new FakeElement("foo", NO_NAMESPACE);
      const child = new FakeElement("abc", ns);
      child.addContent(new FakeText("ABC"));
      const child2 = new FakeElement("xyz", NO_NAMESPACE);
      child2.addContent(new FakeText("XYZ"));
      el.addContent(child);
      el.addContent(child2);
      // Act & Assert
      expect(el.getChildText("abc", ns)).toBe("ABC");
      expect(el.getChildText("xyz", ns)).toBeNull();
    });

    it("should getChildText returns null if not found", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act & Assert
      expect(el.getChildText("notfound")).toBeNull();
    });

    it("should throw error if the arguments are invalid", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act & Assert
      expect(() =>
        // @ts-expect-error
        el.getChildText("child", "invalid")
      ).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeElement\.getChildText/
      );
    });
  });

  describe("getAttributes", () => {
    it("should getAttributes returns all attributes", () => {
      // Arrange
      const ns = new FakeNamespace("p", "http://www.example.com/uri");
      const el = new FakeElement("foo", NO_NAMESPACE);
      el.setAttribute("id", "123");
      el.setAttribute("name", "abc", ns);
      // Act
      const attrs = el.getAttributes();
      // Assert
      expect(attrs.length).toBe(2);
      expect(attrs.find((a) => a.getName() === "id")?.getValue()).toBe("123");
      expect(attrs.find((a) => a.getName() === "name")?.getValue()).toBe("abc");
    });

    it("should getAttributes returns empty array if none", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act & Assert
      expect(el.getAttributes()).toEqual([]);
    });
  });

  describe("getAttribute", () => {
    it("should get attribute", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      el.setAttribute("id", "123");
      // Act
      const attr = el.getAttribute("id");
      // Assert
      expect(attr).not.toBeNull();
      expect(attr?.getValue()).toBe("123");
      expect(el.getAttributes().length).toBe(1);
    });

    it("should get attribute with namespace", () => {
      // Arrange
      const ns = new FakeNamespace("p", "http://www.example.com/uri");
      const el = new FakeElement("foo", NO_NAMESPACE);
      el.setAttribute("id", "123", ns);
      // Act
      const attr = el.getAttribute("id", ns);
      // Assert
      expect(attr).not.toBeNull();
      expect(attr?.getValue()).toBe("123");
      expect(el.getAttributes().length).toBe(1);
    });

    it("should return null if not found", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act & Assert
      expect(el.getAttribute("notfound")).toBeNull();
    });

    it("should throw error if the name is invalid", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act & Assert
      expect(() =>
        // @ts-expect-error
        el.getAttribute(123)
      ).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeElement\.getAttribute/
      );
    });

    it("should throw error if the arguments are invalid", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act & Assert
      expect(() =>
        // @ts-expect-error
        el.getAttribute("child", "invalid")
      ).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeElement\.getAttribute/
      );
    });
  });

  describe("setAttribute", () => {
    it("should set attribute", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act
      el.setAttribute("id", "123");
      // Assert
      const attr = el.getAttribute("id");
      expect(attr).not.toBeNull();
      expect(attr?.getValue()).toBe("123");
      expect(el.getAttributes().length).toBe(1);
    });

    it("should set attribute with namespace", () => {
      // Arrange
      const ns = new FakeNamespace("p", "http://www.example.com/uri");
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act
      el.setAttribute("id", "123", ns);
      // Assert
      const attr = el.getAttribute("id", ns);
      expect(attr).not.toBeNull();
      expect(attr?.getValue()).toBe("123");
      expect(el.getAttributes().length).toBe(1);
    });

    it("should throw error if argument is invalid", () => {
      // Arrange
      const ns = new FakeNamespace("p", "http://www.example.com/uri");
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act & Assert
      expect(() =>
        // @ts-expect-error
        el.setAttribute("foo")
      ).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeElement\.setAttribute/
      );
    });

    it("should throw if setAttribute with wrong type", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act & Assert
      expect(() =>
        // @ts-expect-error
        el.setAttribute({})
      ).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeElement\.setAttribute/
      );
    });

    it("should throw if setAttribute with wrong number of args", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act & Assert
      expect(() =>
        // @ts-expect-error
        el.setAttribute("a", "b", "c", "d")
      ).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeElement\.setAttribute/
      );
    });

    it("should throw if already attached attribute", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      const el2 = new FakeElement("foo2", NO_NAMESPACE);
      const attr = new FakeAttribute("id", NO_NAMESPACE, "v");
      el.setAttribute("id", "123");
      el2.setAttribute(attr);
      // Act & Assert
      expect(() => el.setAttribute(attr)).toThrow(
        /invalid argument: attribute/
      );
    });

    it("should overwrite if setAttribute with the same name", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      el.setAttribute("id", "123");
      // Act
      el.setAttribute("id", "456");
      // Assert
      const attr = el.getAttribute("id");
      expect(attr).not.toBeNull();
      expect(attr?.getValue()).toBe("456");
      expect(el.getAttributes().length).toBe(1);
    });

    it("should overwrite if setAttribute with the same name and namespace", () => {
      // Arrange
      const ns = new FakeNamespace("p", "http://www.example.com/uri");
      const el = new FakeElement("foo", NO_NAMESPACE);
      el.setAttribute("id", "123", ns);
      // Act
      el.setAttribute("id", "456", ns);
      // Assert
      const attr = el.getAttribute("id", ns);
      expect(attr).not.toBeNull();
      expect(attr?.getValue()).toBe("456");
      expect(el.getAttributes().length).toBe(1);
    });

    it("should throw if setAttribute with namespace with prefix incompatible with element's namespace", () => {
      // Arrange
      const ns1 = new FakeNamespace("p", "http://www.example.com/uri1");
      const ns2 = new FakeNamespace("p", "http://www.example.com/uri2");
      const el = new FakeElement("foo", ns1);
      // Act & Assert
      expect(() => el.setAttribute("name", "abc", ns2)).toThrow(
        /name conflict:/
      );
    });

    it("should throw if setAttribute with namespace with prefix incompatible with existing attributes", () => {
      // Arrange
      const ns1 = new FakeNamespace("p", "http://www.example.com/uri1");
      const ns2 = new FakeNamespace("p", "http://www.example.com/uri2");
      const el = new FakeElement("foo", NO_NAMESPACE);
      el.setAttribute("id", "123", ns1);
      // Act & Assert
      expect(() => el.setAttribute("name", "abc", ns2)).toThrow(
        /name conflict:/
      );
    });
  });

  describe("removeAttribute", () => {
    it("should remove attribute by name", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      el.setAttribute("id", "123");
      // Act & Assert
      expect(el.removeAttribute("id")).toBe(true);
      // Assert
      expect(el.getAttribute("id")).toBeNull();
    });

    it("should removeAttribute by attribute node", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      el.setAttribute("id", "123");
      const attr = el.getAttribute("id");
      // Act & Assert
      expect(el.removeAttribute(attr!)).toBe(true);
      // Assert
      expect(el.getAttribute("id")).toBeNull();
    });

    it("should return false if removeAttribute by attribute node not found", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      const attr = new FakeAttribute("id", NO_NAMESPACE, "v");
      // Act & Assert
      expect(el.removeAttribute(attr)).toBe(false);
    });

    it("should throw if removeAttribute by attribute node with wrong type", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act & Assert
      expect(() =>
        // @ts-expect-error
        el.removeAttribute({})
      ).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeElement\.removeAttribute/
      );
    });

    it("should return false if removeAttribute by name not found", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act & Assert
      expect(el.removeAttribute("notfound")).toBe(false);
    });

    it("should removeAttribute by namespace", () => {
      // Arrange
      const ns = new FakeNamespace("p", "http://www.example.com/uri");
      const el = new FakeElement("foo", NO_NAMESPACE);
      el.setAttribute("id", "123", ns);
      // Act & Assert
      expect(el.removeAttribute("id", ns)).toBe(true);
      // Assert
      expect(el.getAttribute("id", ns)).toBeNull();
    });

    it("should removeAttribute by namespace without prefix", () => {
      // Arrange
      const ns = new FakeNamespace("", "");
      const el = new FakeElement("foo", NO_NAMESPACE);
      el.setAttribute("id", "123", ns);
      // Act & Assert
      expect(el.removeAttribute("id", ns)).toBe(true);
      // Assert
      expect(el.getAttribute("id", ns)).toBeNull();
    });

    it("should return false if removeAttribute by namespace not found", () => {
      // Arrange
      const ns = new FakeNamespace("p", "http://www.example.com/uri");
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act & Assert
      expect(el.removeAttribute("id", ns)).toBe(false);
    });

    it("should return false if removeAttribute by namespace with different URI", () => {
      // Arrange
      const ns1 = new FakeNamespace("p", "uri1");
      const ns2 = new FakeNamespace("p", "uri2");
      const el = new FakeElement("foo", NO_NAMESPACE);
      el.setAttribute("id", "123", ns1);
      // Act & Assert
      expect(el.removeAttribute("id", ns2)).toBe(false);
    });

    it("should throw if removeAttribute with invalid args", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act & Assert
      expect(() =>
        // @ts-expect-error
        el.removeAttribute("a", "b", "c")
      ).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeElement\.removeAttribute/
      );
    });
  });

  describe("getText", () => {
    it("should getText with FakeText and FakeCdata", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      el.addContent(new FakeCdata("hello"));
      el.addContent(new FakeText("world"));
      // Act & Assert
      expect(el.getText()).toBe("helloworld");
    });
  });

  describe("setText", () => {
    it("should setText and override contents", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      el.addContent(new FakeText("abc"));
      // Act
      el.setText("xyz");
      // Assert
      expect(el.getText()).toBe("xyz");
      expect(el.getContentSize()).toBe(1);
    });
  });

  describe("isAncestorOf", () => {
    it("should isAncestorOf returns true/false correctly", () => {
      // Arrange
      const el1 = new FakeElement("foo", NO_NAMESPACE);
      const el2 = new FakeElement("bar", NO_NAMESPACE);
      const el3 = new FakeElement("baz", NO_NAMESPACE);
      el1.addContent(el2);
      el2.addContent(el3);
      // Act & Assert
      expect(el1.isAncestorOf(el1)).toBe(false);
      expect(el1.isAncestorOf(el2)).toBe(true);
      expect(el1.isAncestorOf(el3)).toBe(true);
      expect(el2.isAncestorOf(el1)).toBe(false);
      expect(el2.isAncestorOf(el2)).toBe(false);
      expect(el2.isAncestorOf(el3)).toBe(true);
      expect(el3.isAncestorOf(el1)).toBe(false);
      expect(el3.isAncestorOf(el2)).toBe(false);
      expect(el3.isAncestorOf(el3)).toBe(false);
    });

    it("should isAncestorOf throws if the argument is invalid", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act & Assert
      expect(() =>
        // @ts-expect-error
        el.isAncestorOf("invalid")
      ).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeElement\.isAncestorOf/
      );
    });
  });

  describe("isRootElement", () => {
    it("should isRootElement returns false if not attached", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act & Assert
      expect(el.isRootElement()).toBe(false);
    });
  });

  describe("getDocument", () => {
    it("should getDocument returns the owner FakeDocument", () => {
      // Arrange
      const doc = new FakeDocument();
      const el = new FakeElement("foo", NO_NAMESPACE);
      doc.setRootElement(el);
      // Act & Assert
      expect(el.getDocument()).toBe(doc);
    });

    it("should getDocument returns null if parent is not FakeDocument", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act & Assert
      expect(el.getDocument()).toBeNull();
    });
  });

  describe("asElement", () => {
    it("should asElement returns itself", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      // Act & Assert
      expect(el.asElement()).toBe(el);
    });
  });

  describe("getValue", () => {
    it("should getValue returns concatenated values", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      el.addContent(new FakeText("a"));
      el.addContent(new FakeElement("bar", NO_NAMESPACE));
      // Act & Assert
      expect(typeof el.getValue()).toBe("string");
    });
  });

  describe("_clone", () => {
    it("should clone element", () => {
      // Arrange
      const el = new FakeElement("foo", NO_NAMESPACE);
      el.setAttribute("id", "123");
      el.addContent(new FakeText("abc"));
      // Act
      const clone = el._clone();
      // Assert
      expect(clone.getName()).toBe("foo");
      expect(clone.getAttribute("id")?.getValue()).toBe("123");
      expect(clone.getText()).toBe("abc");
      expect(clone).not.toBe(el);
    });

    it("should _clone deep clones attributes and content", () => {
      // Arrange
      const ns = new FakeNamespace("p", "http://www.example.com/uri");
      const el = new FakeElement("foo", ns);
      el.setAttribute("id", "v", ns);
      el.addContent(new FakeText("abc"));
      // Act
      const clone = el._clone();
      // Assert
      expect(clone).not.toBe(el);
      expect(clone.getAttribute("id", ns)?.getValue()).toBe("v");
      expect(clone.getText()).toBe("abc");
    });
  });

  describe("toString", () => {
    it("should toString work", () => {
      // Arrange
      const ns = new FakeNamespace("p", "http://www.example.com/uri");
      const el = new FakeElement("foo", ns);
      el.setAttribute("id", "123");
      el.addContent(new FakeText("abc"));
      // Act & Assert
      expect(el.toString()).toBe("[FakeElement: p:foo]");
    });
  });
});
