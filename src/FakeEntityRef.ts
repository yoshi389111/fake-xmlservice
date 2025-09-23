// DOM interface entity references are obsolete.
// See also: <https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model>

import { AbstractFakeContent } from "./AbstractFakeContent";
import { FakeContentTypes } from "./internal/FakeContentTypes";

/**
 * A fake implementation of the EntityRef interface.
 */
export class FakeEntityRef
  extends AbstractFakeContent
  implements GoogleAppsScript.XML_Service.EntityRef
{
  /**
   * Creates a new FakeEntityRef.
   */
  constructor() {
    super();
  }

  getName(): string {
    return "";
  }

  setName(_name: string): FakeEntityRef {
    return this;
  }

  getPublicId(): string | null {
    return null;
  }

  setPublicId(_id: string | null): FakeEntityRef {
    return this;
  }

  getSystemId(): string | null {
    return null;
  }

  setSystemId(_id: string | null): FakeEntityRef {
    return this;
  }

  override asEntityRef(): FakeEntityRef {
    return this;
  }

  getType(): GoogleAppsScript.XML_Service.ContentType {
    return FakeContentTypes.ENTITYREF;
  }

  override getValue(): string {
    return "";
  }

  override _clone(): FakeEntityRef {
    return new FakeEntityRef();
  }

  override toString(): string {
    return "[FakeEntityRef]";
  }
}
