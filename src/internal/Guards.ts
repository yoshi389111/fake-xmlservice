import { InvalidArgumentException } from "../errors/InvalidArgumentException";

/**
 * Utility functions for validating parameters and XML names.
 */
export namespace Guards {
  /**
   * Checks if the given value is a string.
   * @param value The value to check.
   * @param paramName The name of the parameter.
   * @returns The value if it is a string.
   */
  export function requireString(value: unknown, paramName: string): string {
    if (value === null || value === undefined) {
      throw new InvalidArgumentException(paramName, "is required");
    }
    if (typeof value !== "string") {
      throw new InvalidArgumentException(paramName, "must be a string");
    }
    return value;
  }

  /**
   * Checks if the given value is a boolean.
   * @param value The value to check.
   * @param paramName The name of the parameter.
   * @returns The value if it is a boolean.
   */
  export function requireBoolean(value: unknown, paramName: string): boolean {
    if (value === null || value === undefined) {
      throw new InvalidArgumentException(paramName, "is required");
    }
    if (typeof value !== "boolean") {
      throw new InvalidArgumentException(paramName, "must be a boolean");
    }
    return value;
  }

  /**
   * Checks if the given XML name is valid.
   * @param name The XML name to validate.
   * @param paramName The name of the parameter.
   * @returns The value if it is a valid XML name.
   */
  export function requireValidXmlName(name: string, paramName: string): string {
    requireString(name, paramName);
    if (!isValidXmlName(name)) {
      throw new InvalidArgumentException(
        paramName,
        `invalid XML name: "${name}"`
      );
    }
    return name;
  }

  /** The start characters for a valid NCName. */
  const NCNAME_START =
    "A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF" +
    "\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F" +
    "\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD" +
    "\\u{10000}-\\u{EFFFF}";

  /** The valid characters for a NCName. */
  const NCNAME_CHAR =
    NCNAME_START + "\\-\\.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040";

  /** The regular expression for a valid NCName. */
  const NCNAME_RE = new RegExp(`^[${NCNAME_START}][${NCNAME_CHAR}]*$`, "u");

  /**
   * Checks if the given XML name is valid.
   * @param name The XML name to validate.
   * @returns True if the name is valid, false otherwise.
   */
  export function isValidXmlName(name: string): boolean {
    if (typeof name !== "string" || name.length === 0) {
      return false;
    }
    if (/^xml/i.test(name)) {
      return false;
    }
    return NCNAME_RE.test(name);
  }

  /**
   * Checks if the given prefix of namespace is valid.
   * @param prefix The prefix to validate.
   * @param uri The namespace URI to check against.
   * @returns True if the prefix is valid, false otherwise.
   */
  export function requireValidPrefix(prefix: string, uri: string): string {
    Guards.requireString(prefix, "prefix");
    if (!Guards.isValidPrefix(prefix, uri)) {
      throw new InvalidArgumentException(
        "prefix",
        `invalid XML name: "${prefix}"`
      );
    }

    return prefix;
  }

  /**
   * Checks if the given prefix of namespace is valid.
   * @param prefix The prefix to validate.
   * @param uri The namespace URI to check against.
   * @returns True if the prefix is valid, false otherwise.
   */
  export function isValidPrefix(prefix: string, uri: string): boolean {
    if (prefix === "xml" && uri === "http://www.w3.org/XML/1998/namespace") {
      // standard xml namespace
      return true;
    }

    if (prefix === "") {
      // no namespace or default namespace
      return true;
    }

    if (Guards.isValidXmlName(prefix)) {
      // valid xml name
      return true;
    }

    return false;
  }
}
