/**
 * Helper functions for working with XML namespaces.
 */
export namespace NamespaceHelper {
  /**
   * Check if the namespace is unqualified (no prefix and no URI).
   * @param namespace The namespace to check.
   * @returns True if the namespace is unqualified, false otherwise.
   */
  export function isUnqualified(
    namespace: GoogleAppsScript.XML_Service.Namespace
  ): boolean {
    return namespace.getPrefix() === "" && namespace.getURI() === "";
  }

  /**
   * Check if the namespace is the default namespace (no prefix, URI is not empty).
   * @param namespace The namespace to check.
   * @returns True if the namespace is the default namespace, false otherwise.
   */
  export function isDefault(
    namespace: GoogleAppsScript.XML_Service.Namespace
  ): boolean {
    return namespace.getPrefix() === "" && namespace.getURI() !== "";
  }

  /**
   * Check if the namespace has a prefix (prefix is not empty).
   * @param namespace The namespace to check.
   * @returns True if the namespace has a prefix, false otherwise.
   */
  export function hasPrefix(
    namespace: GoogleAppsScript.XML_Service.Namespace
  ): boolean {
    return namespace.getPrefix() !== "";
  }

  /**
   * Check if two namespaces can coexist.
   * @param ns1 The namespace 1.
   * @param ns2 The namespace 2.
   * @returns True if the namespaces can coexist, false otherwise.
   */
  export function canCoexist(
    ns1: GoogleAppsScript.XML_Service.Namespace,
    ns2: GoogleAppsScript.XML_Service.Namespace
  ): boolean {
    return ns1.getPrefix() !== ns2.getPrefix() || ns1.getURI() === ns2.getURI();
  }
}
