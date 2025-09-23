import { FakeText } from "./FakeText";
import { FakeContentTypes } from "./internal/FakeContentTypes";
import { Guards } from "./internal/Guards";

/**
 * A fake implementation of the Cdata interface.
 */
export class FakeCdata
  extends FakeText
  implements GoogleAppsScript.XML_Service.Cdata
{
  /**
   * Creates a new FakeCdata.
   * @param text The text content.
   */
  constructor(text: string) {
    super(Guards.requireString(text, "text"));
  }

  override asCdata(): FakeCdata {
    return this;
  }

  override getType(): GoogleAppsScript.XML_Service.ContentType {
    return FakeContentTypes.CDATA;
  }

  override _clone(): FakeCdata {
    return new FakeCdata(this.getText());
  }

  override toString(): string {
    return `[FakeCdata: ${this.getText()}]`;
  }
}
