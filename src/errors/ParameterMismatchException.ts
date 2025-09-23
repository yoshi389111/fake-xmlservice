/**
 * An exception thrown when method parameters do not match the expected signature.
 */
export class ParameterMismatchException extends Error {
  /**
   * Creates a new ParameterMismatchException.
   * @param name The method/function name.
   * @param args The arguments that were passed to the method.
   */
  constructor(name: string, args: unknown[]) {
    super(ParameterMismatchException.createMessage(name, args));
    this.name = "Exception";
  }

  /**
   * Creates an error message for the exception.
   * @param name The method/function name.
   * @param args The arguments that were passed to the method.
   * @returns The error message.
   */
  private static createMessage(name: string, args: unknown[]): string {
    const params = args
      .map((arg) => ParameterMismatchException.getTypeName(arg))
      .join(",");
    return `The parameters (${params}) don't match the method signature for ${name}`;
  }

  /**
   * Gets the type name of a value.
   * @param value The value to get the type name of.
   * @returns The type name of the value.
   */
  private static getTypeName(value: unknown): string {
    if (value === null) {
      return "null";
    }

    if (value === undefined) {
      return "undefined";
    }

    const baseType = typeof value;
    if (baseType !== "object" && baseType !== "function") {
      // primitive type
      return baseType;
    }

    const obj = value as { [Symbol.toStringTag]?: unknown };
    const tag = obj[Symbol.toStringTag];
    if (typeof tag === "string" && tag.length > 0) {
      return tag;
    }

    if (
      baseType === "function" &&
      Function.prototype.toString.call(value).startsWith("class ")
    ) {
      return "class";
    }

    const className = value.constructor?.name;
    if (typeof className === "string" && className.length > 0) {
      return className;
    }

    return baseType;
  }
}
