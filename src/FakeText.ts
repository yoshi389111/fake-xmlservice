import { AbstractFakeContent } from "./AbstractFakeContent";
import { FakeContentTypes } from "./internal/FakeContentTypes";
import { Guards } from "./internal/Guards";

/**
 * A fake implementation of the Text interface.
 */
export class FakeText
  extends AbstractFakeContent
  implements GoogleAppsScript.XML_Service.Text
{
  /** The text content. */
  private _text: string;

  /**
   * Creates a new FakeText.
   * @param text The text content.
   */
  constructor(text: string) {
    super();
    this._text = Guards.requireString(text, "text");
  }

  getText(): string {
    return this._text;
  }

  setText(text: string): FakeText {
    this._text = Guards.requireString(text, "text");
    return this;
  }

  append(text: string): FakeText {
    this._text += Guards.requireString(text, "text");
    return this;
  }

  override asText(): FakeText {
    return this;
  }

  getType(): GoogleAppsScript.XML_Service.ContentType {
    return FakeContentTypes.TEXT;
  }

  override getValue(): string {
    return this._text;
  }

  override _clone(): FakeText {
    return new FakeText(this._text);
  }

  override toString(): string {
    return `[FakeText: ${this._text}]`;
  }
}
