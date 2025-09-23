/**
 * An exception thrown when an invalid argument is provided to a method.
 */
export class InvalidArgumentException extends Error {
  /**
   * Creates a new InvalidArgumentException.
   * @param name The name of the argument.
   * @param message The error message.
   */
  constructor(name: string, message: string) {
    super(`invalid argument: ${name} - ${message}`);
    this.name = "Exception";
  }
}
