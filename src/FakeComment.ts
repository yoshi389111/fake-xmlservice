import { AbstractFakeContent } from "./AbstractFakeContent";
import { FakeContentTypes } from "./internal/FakeContentTypes";
import { Guards } from "./internal/Guards";

/**
 * A fake implementation of the Comment interface.
 */
export class FakeComment
  extends AbstractFakeContent
  implements GoogleAppsScript.XML_Service.Comment
{
  /** The text content of the comment. */
  private _comment: string;

  /**
   * Creates a new FakeComment.
   * @param comment The text content of the comment.
   */
  constructor(comment: string) {
    super();
    this._comment = Guards.requireString(comment, "comment");
  }

  getText(): string {
    return this._comment;
  }

  setText(text: string): FakeComment {
    this._comment = Guards.requireString(text, "text");
    return this;
  }

  override getValue(): string {
    return this._comment;
  }

  override asComment(): FakeComment {
    return this;
  }

  getType(): GoogleAppsScript.XML_Service.ContentType {
    return FakeContentTypes.COMMENT;
  }

  override _clone(): FakeComment {
    return new FakeComment(this._comment);
  }

  override toString(): string {
    return `[FakeComment: ${this._comment}]`;
  }
}
