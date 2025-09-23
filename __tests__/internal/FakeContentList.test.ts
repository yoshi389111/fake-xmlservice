import { FakeContentList } from "../../src/internal/FakeContentList";
import { FakeElement } from "../../src/FakeElement";
import { FakeText } from "../../src/FakeText";
import { FakeNamespace } from "../../src/FakeNamespace";
import { InvalidArgumentException } from "../../src/errors/InvalidArgumentException";
import { FakeComment } from "../../src/FakeComment";

const NO_NAMESPACE = FakeNamespace.NO_NAMESPACE;

describe("FakeContentList", () => {
  describe("appendContent", () => {
    it("should append content", () => {
      // Arrange
      const holder = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeContentList(holder);
      const text1 = new FakeText("a");
      const text2 = new FakeText("b");
      // Act
      list.appendContent(text1, "content");
      // Assert
      expect(list.size()).toBe(1);
      expect(list.getContentAt(0)).toBe(text1);
    });

    it("should throw if content is already attached", () => {
      // Arrange
      const holder = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeContentList(holder);
      const text = new FakeText("a");
      text._setParent(holder);
      // Act & Assert
      expect(() => list.appendContent(text, "content")).toThrow(
        InvalidArgumentException
      );
    });
  });

  describe("insertContent", () => {
    it("should insert content", () => {
      // Arrange
      const holder = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeContentList(holder);
      const text1 = new FakeText("a");
      const text2 = new FakeText("b");
      list.appendContent(text1, "content");
      expect(list.size()).toBe(1);
      expect(list.getContentAt(0)).toBe(text1);
      // Act
      list.insertContent(0, text2, "content");
      // Assert
      expect(list.size()).toBe(2);
      expect(list.getContentAt(0)).toBe(text2);
      expect(list.getContentAt(1)).toBe(text1);
    });

    it("should throw if index is out of range", () => {
      // Arrange
      const holder = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeContentList(holder);
      const text = new FakeText("a");
      // Act & Assert
      expect(() => list.insertContent(1, text, "content")).toThrow(
        InvalidArgumentException
      );
      expect(() => list.insertContent(-1, text, "content")).toThrow(
        InvalidArgumentException
      );
    });
  });

  describe("removeAllContents", () => {
    it("should remove all contents", () => {
      // Arrange
      const holder = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeContentList(holder);
      const text1 = new FakeText("a");
      const text2 = new FakeText("b");
      list.appendContent(text1, "content");
      list.appendContent(text2, "content");
      // Act
      const removed = list.removeAllContents();
      // Assert
      expect(removed).toEqual([text1, text2]);
      expect(list.size()).toBe(0);
      expect(text1._getParent()).toBeNull();
      expect(text2._getParent()).toBeNull();
    });
  });

  describe("removeContent", () => {
    it("should remove content by node", () => {
      // Arrange
      const holder = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeContentList(holder);
      const text = new FakeText("a");
      list.appendContent(text, "content");
      // Act & Assert
      expect(list.removeContent(text)).toBe(true);
      // Assert
      expect(list.size()).toBe(0);
      expect(text._getParent()).toBeNull();
    });

    it("should return false if removeContent not found", () => {
      // Arrange
      const holder = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeContentList(holder);
      const text = new FakeText("a");
      // Act & Assert
      expect(list.removeContent(text)).toBe(false);
    });
  });

  describe("removeContentAt", () => {
    it("should remove content by index", () => {
      // Arrange
      const holder = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeContentList(holder);
      const text = new FakeText("a");
      list.appendContent(text, "content");
      // Act & Assert
      expect(list.removeContentAt(0)).toBe(text);
      // Assert
      expect(list.size()).toBe(0);
      expect(text._getParent()).toBeNull();
    });

    it("should return null if removeContentAt index is invalid", () => {
      // Arrange
      const holder = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeContentList(holder);
      // Act & Assert
      expect(list.removeContentAt(0)).toBeNull();
      expect(list.removeContentAt(-1)).toBeNull();
    });
  });

  describe("getAllContents", () => {
    it("should get all contents", () => {
      // Arrange
      const holder = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeContentList(holder);
      const text = new FakeText("a");
      const comment = new FakeComment("c");
      list.appendContent(text, "content");
      list.appendContent(comment, "content");
      // Act & Assert
      expect(list.getAllContents()).toEqual([text, comment]);
    });
  });

  describe("getContentAt", () => {
    it("should get content by index", () => {
      // Arrange
      const holder = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeContentList(holder);
      const text = new FakeText("a");
      const comment = new FakeComment("c");
      list.appendContent(text, "content");
      list.appendContent(comment, "content");
      // Act & Assert
      expect(list.getContentAt(0)).toBe(text);
      expect(list.getContentAt(1)).toBe(comment);
    });

    it("should getContentAt returns null if out of range", () => {
      // Arrange
      const holder = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeContentList(holder);
      // Act & Assert
      expect(list.getContentAt(0)).toBeNull();
      expect(list.getContentAt(-1)).toBeNull();
    });
  });

  describe("indexOf", () => {
    it("should return index", () => {
      // Arrange
      const holder = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeContentList(holder);
      const text = new FakeText("a");
      const comment = new FakeComment("c");
      list.appendContent(text, "content");
      list.appendContent(comment, "content");
      // Act & Assert
      expect(list.indexOf(text)).toBe(0);
      expect(list.indexOf(comment)).toBe(1);
    });
  });

  describe("size", () => {
    it("should get size", () => {
      // Arrange
      const holder = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeContentList(holder);
      // Act & Assert
      expect(list.size()).toBe(0);

      // Arrange
      const text = new FakeText("a");
      list.appendContent(text, "content");
      // Act & Assert
      expect(list.size()).toBe(1);

      // Arrange
      const comment = new FakeComment("c");
      list.appendContent(comment, "content");
      // Act & Assert
      expect(list.size()).toBe(2);
    });
  });

  describe("getAllElements/getElements/getElement", () => {
    it("should get all elements", () => {
      // Arrange
      const holder = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeContentList(holder);
      const el1 = new FakeElement("a", NO_NAMESPACE);
      const el2 = new FakeElement("b", NO_NAMESPACE);
      const text = new FakeText("t");
      list.appendContent(el1, "content");
      list.appendContent(text, "content");
      list.appendContent(el2, "content");
      // Act & Assert
      expect(list.getAllElements()).toEqual([el1, el2]);
    });

    it("should get elements by name and namespace", () => {
      // Arrange
      const holder = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeContentList(holder);
      const ns = new FakeNamespace("p", "uri");
      const el1 = new FakeElement("foo", ns);
      const el2 = new FakeElement("foo", NO_NAMESPACE);
      list.appendContent(el1, "content");
      list.appendContent(el2, "content");
      expect(list.getElements("foo", ns)).toEqual([el1]);
      expect(list.getElements("foo", NO_NAMESPACE)).toEqual([el2]);
    });

    it("should get element by name and namespace", () => {
      // Arrange
      const holder = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeContentList(holder);
      const ns = new FakeNamespace("p", "uri");
      const el1 = new FakeElement("foo", ns);
      list.appendContent(el1, "content");
      expect(list.getElement("foo", ns)).toBe(el1);
      expect(list.getElement("bar", ns)).toBeNull();
    });
  });

  describe("clone", () => {
    it("should clone content list", () => {
      // Arrange
      const holder = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeContentList(holder);
      const el = new FakeElement("foo", NO_NAMESPACE);
      const text = new FakeText("abc");
      list.appendContent(el, "content");
      list.appendContent(text, "content");
      const newHolder = new FakeElement("new", NO_NAMESPACE);
      // Act
      const cloneList = list.clone(newHolder);
      // Assert
      expect(cloneList).not.toBe(list);
      expect(cloneList.size()).toBe(2);
      expect(cloneList.getAllContents()[0]).not.toBe(el);
      expect(cloneList.getAllContents()[1]).not.toBe(text);
      expect(cloneList.getAllContents()[0]?._getParent()).toBe(newHolder);
      expect(cloneList.getAllContents()[1]?._getParent()).toBe(newHolder);
    });
  });

  describe("cloneContents", () => {
    it("should clone contents", () => {
      // Arrange
      const holder = new FakeElement("root", NO_NAMESPACE);
      const list = new FakeContentList(holder);
      const el = new FakeElement("foo", NO_NAMESPACE);
      const text = new FakeText("abc");
      list.appendContent(el, "content");
      list.appendContent(text, "content");
      // Act
      const clonedContents = list.cloneContents();
      // Assert
      expect(clonedContents.length).toBe(2);
      expect(clonedContents[0]).not.toBe(el);
      expect(clonedContents[1]).not.toBe(text);
    });
  });
});
