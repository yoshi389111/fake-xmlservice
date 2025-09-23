/**
 * An exception thrown when there is a name conflict in XML elements or attributes.
 */
export class NameConflictException extends Error {
  /**
   * Creates a new NameConflictException.
   * @param namespace The conflicting namespace.
   * @param name The name of the attribute. (optional)
   */
  constructor(
    namespace: GoogleAppsScript.XML_Service.Namespace,
    name?: string
  ) {
    super(
      name === undefined
        ? `namespace conflict: ${namespace}`
        : `name conflict: ${name} ${namespace}`
    );
    this.name = "Exception";
  }
}
