import { AbstractFakeContent } from "./AbstractFakeContent";
import { FakeContentTypes } from "./internal/FakeContentTypes";
import { Guards } from "./internal/Guards";

/**
 * A fake implementation of the ProcessingInstruction interface.
 */
export class FakeProcessingInstruction
  extends AbstractFakeContent
  implements GoogleAppsScript.XML_Service.ProcessingInstruction
{
  /** The data of the processing instruction. */
  private _data: string;
  /** The target of the processing instruction. */
  private _target: string;

  /**
   * Creates a new FakeProcessingInstruction.
   * @param data The data of the processing instruction.
   * @param target The target of the processing instruction.
   */
  constructor(data: string, target: string) {
    super();
    this._data = Guards.requireString(data, "data");
    this._target = Guards.requireString(target, "target");
  }

  getData(): string {
    return this._data;
  }

  getTarget(): string {
    return this._target;
  }

  override getValue(): string {
    return this._data;
  }

  override asProcessingInstruction(): FakeProcessingInstruction {
    return this;
  }

  getType(): GoogleAppsScript.XML_Service.ContentType {
    return FakeContentTypes.PROCESSINGINSTRUCTION;
  }

  override _clone(): FakeProcessingInstruction {
    return new FakeProcessingInstruction(this._data, this._target);
  }

  override toString(): string {
    return `[FakeProcessingInstruction: ${this._target} ${this._data}]`;
  }
}
