import { FakeCdata } from "../src/FakeCdata";
import { FakeComment } from "../src/FakeComment";
import { FakeDocType } from "../src/FakeDocType";
import { FakeDocument } from "../src/FakeDocument";
import { FakeElement } from "../src/FakeElement";
import { FakeNamespace } from "../src/FakeNamespace";
import { FakeProcessingInstruction } from "../src/FakeProcessingInstruction";
import { FakeText } from "../src/FakeText";

const NO_NAMESPACE = FakeNamespace.NO_NAMESPACE;

describe("FakeDocument", () => {
  describe("addContent", () => {
    it("should add contents", () => {
      // Arrange
      const doc = new FakeDocument();
      const dt = new FakeDocType("root", null, null, null);
      const comment = new FakeComment("comment");
      const pi = new FakeProcessingInstruction("data", "target");
      const el = new FakeElement("root", NO_NAMESPACE);
      const comment2 = new FakeComment("comment2");
      // Act
      doc.addContent(comment);
      doc.addContent(0, dt);
      doc.addContent(pi);
      doc.addContent(2, el);
      doc.addContent(4, comment2);
      // Assert
      expect(doc.getDocType()).toBe(dt);
      expect(doc.getRootElement()).toBe(el);
      expect(doc.getContentSize()).toBe(5);
      const allContent = doc.getAllContent();
      expect(allContent[0]).toBe(dt);
      expect(allContent[1]).toBe(comment);
      expect(allContent[2]).toBe(el);
      expect(allContent[3]).toBe(pi);
      expect(allContent[4]).toBe(comment2);
    });

    it("should throw an error when adding unacceptable contents", () => {
      // Arrange
      const doc = new FakeDocument();
      const cdata = new FakeCdata("cdata");
      const text = new FakeText("text");
      // Act & Assert
      expect(() => doc.addContent(cdata)).toThrow(/invalid argument: content/);
      expect(() => doc.addContent(text)).toThrow(/invalid argument: content/);
    });

    it("should throw an error when arguments are invalid", () => {
      // Arrange
      const doc = new FakeDocument();
      // Act & Assert
      expect(() =>
        // @ts-expect-error
        doc.addContent("invalid")
      ).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeDocument\.addContent/
      );
      expect(() =>
        // @ts-expect-error
        doc.addContent()
      ).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeDocument\.addContent/
      );
      expect(() =>
        doc.addContent(
          0,
          new FakeComment("comment"),
          // @ts-expect-error
          "invalid"
        )
      ).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeDocument\.addContent/
      );
      expect(() => doc.addContent(-1, new FakeComment("comment"))).toThrow(
        /invalid argument: index/
      );
      expect(() => doc.addContent(3, new FakeComment("comment"))).toThrow(
        /invalid argument: index/
      );
    });

    it("should throw an error when adding a second root element", () => {
      // Arrange
      const doc = new FakeDocument();
      doc.addContent(new FakeElement("root", NO_NAMESPACE));
      const root2 = new FakeElement("root2", NO_NAMESPACE);
      // Act & Assert
      expect(() => doc.addContent(root2)).toThrow(/invalid argument: content/);
    });

    it("should throw an error when adding a second DocType", () => {
      // Arrange
      const doc = new FakeDocument();
      doc.addContent(new FakeDocType("dtype", null, null, null));
      const dtype2 = new FakeDocType("dtype2", null, null, null);
      // Act & Assert
      expect(() => doc.addContent(dtype2)).toThrow(/invalid argument: content/);
    });

    it("should inserting a `DocType` before `Element`", () => {
      // Arrange
      const doc = new FakeDocument();
      const comment = new FakeComment("comment");
      const el = new FakeElement("root", NO_NAMESPACE);
      const dt = new FakeDocType("doctype", null, null, null);
      doc.addContent(comment);
      doc.addContent(el);
      // Act
      doc.addContent(1, dt);
      // Assert
      expect(doc.getContentSize()).toBe(3);
      expect(doc.getContent(0)).toBe(comment);
      expect(doc.getContent(1)).toBe(dt);
      expect(doc.getContent(2)).toBe(el);
    });

    it("should throw an error when adding `DocType` after `Element`", () => {
      // Arrange
      const doc = new FakeDocument();
      doc.addContent(new FakeElement("root", NO_NAMESPACE));
      const dtype = new FakeDocType("dtype", null, null, null);
      // Act & Assert
      expect(() => doc.addContent(dtype)).toThrow(/invalid argument: content/);
    });

    it("should throw an error when inserting `Element` before `DocType`", () => {
      // Arrange
      const doc = new FakeDocument();
      doc.addContent(new FakeDocType("dtype", null, null, null));
      const el = new FakeElement("root", NO_NAMESPACE);
      // Act & Assert
      expect(() => doc.addContent(0, el)).toThrow(/invalid argument: content/);
    });

    it("should throw an error when adding content that already has a parent", () => {
      // Arrange
      const doc = new FakeDocument();
      const el = new FakeElement("root", NO_NAMESPACE);
      doc.addContent(el);
      const doc2 = new FakeDocument();
      // Act & Assert
      expect(() => doc2.addContent(el)).toThrow(/invalid argument: content/);
    });
  });

  describe("getAllContent", () => {
    it("should get all contents with getAllContent", () => {
      // Arrange
      const doc = new FakeDocument();
      const dt = new FakeDocType("root", null, null, null);
      const comment = new FakeComment("comment");
      const el = new FakeElement("root", NO_NAMESPACE);
      doc.addContent(dt);
      doc.addContent(comment);
      doc.addContent(el);
      // Act
      const allContent = doc.getAllContent();
      // Assert
      expect(allContent.length).toBe(3);
      expect(allContent[0]).toBe(dt);
      expect(allContent[1]).toBe(comment);
      expect(allContent[2]).toBe(el);
    });

    it("should get empty array with getAllContent for a document with no content", () => {
      // Arrange
      const doc = new FakeDocument();
      // Act
      const allContent = doc.getAllContent();
      // Assert
      expect(allContent.length).toBe(0);
    });
  });

  describe("getContent", () => {
    it("should get content by index with getContent", () => {
      // Arrange
      const doc = new FakeDocument();
      const comment = new FakeComment("comment");
      const dt = new FakeDocType("doctype", null, null, null);
      const el = new FakeElement("root", NO_NAMESPACE);
      doc.addContent(comment);
      doc.addContent(dt);
      doc.addContent(el);
      // Act & Assert
      expect(doc.getContent(0)).toBe(comment);
      expect(doc.getContent(1)).toBe(dt);
      expect(doc.getContent(2)).toBe(el);
    });

    it("should return null for getContent with out-of-range index", () => {
      // Arrange
      const doc = new FakeDocument();
      // Act & Assert
      expect(doc.getContent(0)).toBeNull();
      expect(doc.getContent(-1)).toBeNull();
      expect(doc.getContent(1)).toBeNull();

      // Arrange
      doc.addContent(new FakeComment("c"));
      // Act & Assert
      expect(doc.getContent(0)).not.toBeNull();
      expect(doc.getContent(-1)).toBeNull();
      expect(doc.getContent(1)).toBeNull();
    });

    it("should throw an error for getContent with invalid argument", () => {
      // Arrange
      const doc = new FakeDocument();
      // Act & Assert
      expect(() =>
        // @ts-expect-error
        doc.getContent("invalid")
      ).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeDocument\.getContent/
      );
    });
  });

  describe("getContentSize", () => {
    it("should return the number of contents after adding contents", () => {
      // Arrange
      const doc = new FakeDocument();
      // Act & Assert
      expect(doc.getContentSize()).toBe(0);

      // Arrange
      doc.addContent(new FakeComment("comment"));
      // Act & Assert
      expect(doc.getContentSize()).toBe(1);

      // Arrange
      doc.addContent(new FakeDocType("root", null, null, null));
      // Act & Assert
      expect(doc.getContentSize()).toBe(2);

      // Arrange
      doc.addContent(new FakeElement("root", NO_NAMESPACE));
      // Act & Assert
      expect(doc.getContentSize()).toBe(3);
    });
  });

  describe("removeContent", () => {
    it("should remove all content with `removeContent`", () => {
      // Arrange
      const doc = new FakeDocument();
      const dt = new FakeDocType("root", null, null, null);
      const comment = new FakeComment("comment");
      const el = new FakeElement("root", NO_NAMESPACE);
      doc.addContent(dt);
      doc.addContent(comment);
      doc.addContent(el);
      expect(doc.getContentSize()).toBe(3);
      // Act
      const removed = doc.removeContent();
      // Assert
      expect(doc.getContentSize()).toBe(0);
      expect(doc.getRootElement()).toBeNull();
      expect(doc.getDocType()).toBeNull();
      expect(removed.length).toBe(3);
      expect(removed[0]).toBe(dt);
      expect(removed[1]).toBe(comment);
      expect(removed[2]).toBe(el);
    });

    it("should remove specified content with removeContent", () => {
      // Arrange
      const doc = new FakeDocument();
      const el = new FakeElement("root", NO_NAMESPACE);
      doc.addContent(el);
      // Act & Assert
      expect(doc.removeContent(el)).toBe(true);
      // Assert
      expect(doc.getContentSize()).toBe(0);
      expect(doc.getRootElement()).toBeNull();
    });

    it("should remove content at specified index with removeContent", () => {
      // Arrange
      const doc = new FakeDocument();
      const dt = new FakeDocType("root", null, null, null);
      const comment = new FakeComment("comment");
      const el = new FakeElement("root", NO_NAMESPACE);
      doc.addContent(dt);
      doc.addContent(comment);
      doc.addContent(el);
      expect(doc.getRootElement()).toBe(el);
      expect(doc.getDocType()).toBe(dt);

      // Act & Assert
      expect(doc.removeContent(2)).toBe(el);
      // Assert
      expect(doc.getContentSize()).toBe(2);
      expect(doc.getRootElement()).toBeNull();
      expect(doc.getDocType()).not.toBeNull();

      // Act & Assert
      expect(doc.removeContent(1)).toBe(comment);
      // Assert
      expect(doc.getContentSize()).toBe(1);
      expect(doc.getRootElement()).toBeNull();
      expect(doc.getDocType()).not.toBeNull();

      // Act & Assert
      expect(doc.removeContent(0)).toBe(dt);
      // Assert
      expect(doc.getContentSize()).toBe(0);
      expect(doc.getRootElement()).toBeNull();
      expect(doc.getDocType()).toBeNull();
    });

    it("should return null for removeContent with out-of-range index", () => {
      // Arrange
      const doc = new FakeDocument();
      // Act & Assert
      expect(doc.removeContent(0)).toBeNull();
      expect(doc.removeContent(-1)).toBeNull();
      expect(doc.removeContent(1)).toBeNull();
    });

    it("should return false for removeContent with non-existent content", () => {
      // Arrange
      const doc = new FakeDocument();
      const el = new FakeElement("root", NO_NAMESPACE);
      // Act & Assert
      expect(doc.removeContent(el)).toBe(false);
    });

    it("should throw an error for removeContent with invalid argument", () => {
      // Arrange
      const doc = new FakeDocument();
      // Act & Assert
      expect(() =>
        // @ts-expect-error
        doc.removeContent("invalid")
      ).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeDocument\.removeContent/
      );
    });
  });

  describe("cloneContent", () => {
    it("should clone content with cloneContent", () => {
      // Arrange
      const doc = new FakeDocument();
      const el = new FakeElement("root", NO_NAMESPACE);
      const child = new FakeElement("child", NO_NAMESPACE);
      const text = new FakeText("text");
      doc.addContent(el);
      el.addContent(child);
      child.addContent(text);
      // Act
      const clones = doc.cloneContent();
      // Assert
      expect(clones.length).toBe(1);
      expect(clones[0]).not.toBe(el);
      expect(clones[0] instanceof FakeElement).toBe(true);
      expect((clones[0] as FakeElement).getName()).toBe("root");
      const childClones = (clones[0] as FakeElement).getChildren();
      expect(childClones.length).toBe(1);
      expect(childClones[0]).not.toBe(child);
      expect(childClones[0] instanceof FakeElement).toBe(true);
      expect((childClones[0] as FakeElement).getName()).toBe("child");
      expect((childClones[0] as FakeElement)._getParent()).toBe(clones[0]);
      const textClones = (childClones[0] as FakeElement).getAllContent();
      expect(textClones.length).toBe(1);
      expect(textClones[0]).not.toBe(text);
      expect(textClones[0] instanceof FakeText).toBe(true);
      expect((textClones[0] as FakeText).getText()).toBe("text");
      expect((textClones[0] as FakeText)._getParent()).toBe(childClones[0]);
    });
  });

  describe("getRootElement", () => {
    it("should return null for a new document", () => {
      // Arrange
      const doc = new FakeDocument();
      // Act & Assert
      expect(doc.getRootElement()).toBeNull();
    });

    it("should return the root element after adding an element", () => {
      // Arrange
      const doc = new FakeDocument();
      const el = new FakeElement("root", NO_NAMESPACE);
      doc.addContent(el);
      // Act & Assert
      expect(doc.getRootElement()).toBe(el);
    });
  });

  describe("hasRootElement", () => {
    it("should return true for hasRootElement if root element exists", () => {
      // Arrange
      const doc = new FakeDocument();
      // Act & Assert
      expect(doc.hasRootElement()).toBe(false);

      // Arrange
      doc.addContent(new FakeElement("root", NO_NAMESPACE));
      // Act & Assert
      expect(doc.hasRootElement()).toBe(true);
    });
  });

  describe("setRootElement", () => {
    it("should set root element with setRootElement", () => {
      // Arrange
      const doc = new FakeDocument();
      const el = new FakeElement("root", NO_NAMESPACE);
      doc.addContent(new FakeComment("comment"));
      // Act
      doc.setRootElement(el);
      // Assert
      expect(doc.getRootElement()).toBe(el);
      expect(doc.getContentSize()).toBe(2);
      expect(doc.getContent(1)).toBe(el);
    });

    it("should replace existing root element", () => {
      // Arrange
      const doc = new FakeDocument();
      const el1 = new FakeElement("root", NO_NAMESPACE);
      const el2 = new FakeElement("root2", NO_NAMESPACE);
      doc.addContent(el1);
      doc.addContent(new FakeComment("comment"));
      // Act
      doc.setRootElement(el2);
      // Assert
      expect(doc.getRootElement()).toBe(el2);
      expect(doc.getContentSize()).toBe(2);
      expect(doc.getContent(0)).toBe(el2);
    });

    it("should throw an error with already attached element", () => {
      // Arrange
      const doc = new FakeDocument();
      const el = new FakeElement("root", NO_NAMESPACE);
      doc.addContent(el);
      const doc2 = new FakeDocument();
      // Act & Assert
      expect(() => doc2.setRootElement(el)).toThrow(
        /invalid argument: element/
      );
    });

    it("should throw an error for setRootElement with invalid element", () => {
      const doc = new FakeDocument();
      expect(() =>
        // @ts-expect-error
        doc.setRootElement({})
      ).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeDocument\.setRootElement/
      );
    });
  });

  describe("detachRootElement", () => {
    it("should detach root element with detachRootElement", () => {
      // Arrange
      const doc = new FakeDocument();
      const el = new FakeElement("root", NO_NAMESPACE);
      doc.addContent(el);
      // Act
      const detached = doc.detachRootElement();
      // Assert
      expect(detached).toBe(el);
      expect(doc.getRootElement()).toBeNull();
      expect(doc.getContentSize()).toBe(0);
    });

    it("should return null for detachRootElement if no root element", () => {
      // Arrange
      const doc = new FakeDocument();
      // Act & Assert
      expect(doc.detachRootElement()).toBeNull();
    });
  });

  describe("getDocType", () => {
    it("should return null for a new document", () => {
      // Arrange
      const doc = new FakeDocument();
      // Act & Assert
      expect(doc.getDocType()).toBeNull();
    });

    it("should return the DocType after adding a DocType", () => {
      // Arrange
      const doc = new FakeDocument();
      const dt = new FakeDocType("root", null, null, null);
      doc.addContent(dt);
      // Act & Assert
      expect(doc.getDocType()).toBe(dt);
    });
  });

  describe("setDocType", () => {
    it("should set DocType", () => {
      // Arrange
      const doc = new FakeDocument();
      const dt1 = new FakeDocType("root", null, null, null);
      const comment = new FakeComment("comment");
      doc.addContent(comment);
      // Act
      doc.setDocType(dt1); // insert
      // Assert
      expect(doc.getDocType()).toBe(dt1);
      expect(doc.getContentSize()).toBe(2);
      expect(doc.getContent(0)).toBe(dt1);
      expect(doc.getContent(1)).toBe(comment);
    });

    it("should replace existing DocType", () => {
      // Arrange
      const doc = new FakeDocument();
      const dt1 = new FakeDocType("root", null, null, null);
      const dt2 = new FakeDocType("root2", null, null, null);
      const comment = new FakeComment("comment");
      doc.addContent(comment);
      doc.setDocType(dt1); // insert
      // Act
      doc.setDocType(dt2); // replace
      // Assert
      expect(doc.getDocType()).toBe(dt2);
      expect(doc.getContentSize()).toBe(2);
      expect(doc.getContent(0)).toBe(dt2);
      expect(doc.getContent(1)).toBe(comment);
    });

    it("should throw an error with invalid DocType", () => {
      // Arrange
      const doc = new FakeDocument();
      // Act & Assert
      expect(() =>
        // @ts-expect-error
        doc.setDocType({})
      ).toThrow(
        /The parameters \(.*\) don't match the method signature for FakeDocument\.setDocType/
      );
    });

    it("should throw an error which already attached DocType", () => {
      // Arrange
      const doc = new FakeDocument();
      const dt = new FakeDocType("root", null, null, null);
      new FakeDocument().setDocType(dt);
      // Act & Assert
      expect(() => doc.setDocType(dt)).toThrow(/invalid argument: docType/);
    });
  });

  describe("getDescendants", () => {
    it("should return an empty array if document has no content", () => {
      // Arrange
      const doc = new FakeDocument();
      // Act & Assert
      expect(doc.getDescendants()).toEqual([]);
    });

    it("should return only the root element if no children", () => {
      // Arrange
      const doc = new FakeDocument();
      const el = new FakeElement("root", NO_NAMESPACE);
      doc.addContent(el);
      // Act & Assert
      expect(doc.getDescendants()).toEqual([el]);
    });

    it("should return all descendants in depth-first order", () => {
      // Arrange
      const doc = new FakeDocument();
      const root = new FakeElement("root", NO_NAMESPACE);
      const child1 = new FakeElement("child1", NO_NAMESPACE);
      const child2 = new FakeElement("child2", NO_NAMESPACE);
      const grandchild = new FakeElement("grandchild", NO_NAMESPACE);
      child1.addContent(grandchild);
      root.addContent(child1);
      root.addContent(child2);
      doc.addContent(root);
      // Act & Assert
      expect(doc.getDescendants()).toEqual([root, child1, grandchild, child2]);
    });

    it("should include comments, DocType, and processing instructions", () => {
      // Arrange
      const doc = new FakeDocument();
      const dt = new FakeDocType("root", null, null, null);
      const comment = new FakeComment("c");
      const pi = new FakeProcessingInstruction("data", "target");
      const root = new FakeElement("root", NO_NAMESPACE);
      doc.addContent(dt);
      doc.addContent(comment);
      doc.addContent(pi);
      doc.addContent(root);
      // Act & Assert
      expect(doc.getDescendants()).toEqual([dt, comment, pi, root]);
    });

    it("should include descendants of root element after other content", () => {
      // Arrange
      const doc = new FakeDocument();
      const dt = new FakeDocType("root", null, null, null);
      const comment = new FakeComment("c");
      const root = new FakeElement("root", NO_NAMESPACE);
      const child = new FakeElement("child", NO_NAMESPACE);
      root.addContent(child);
      doc.addContent(dt);
      doc.addContent(comment);
      doc.addContent(root);
      // Act & Assert
      expect(doc.getDescendants()).toEqual([dt, comment, root, child]);
    });
  });

  describe("toString", () => {
    it("should return a string representation", () => {
      // Arrange
      const doc = new FakeDocument();
      // Act & Assert
      expect(doc.toString()).toBe("[FakeDocument]");
    });
  });
});
