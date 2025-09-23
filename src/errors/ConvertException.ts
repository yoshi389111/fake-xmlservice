/**
 * An exception thrown when a conversion operation fails.
 */
export class ConvertException extends Error {
  /**
   * Creates a new ConvertException.
   * @param detail The detail message.
   * @param cause The cause of the error.
   */
  constructor(detail: string, cause: unknown) {
    super(`convert failed: ${detail}`, { cause });
    this.name = "Exception";
  }
}
