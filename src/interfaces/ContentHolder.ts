/**
 * An interface representing a holder of XML content.
 */
export interface ContentHolder {
  /**
   * Remove the specified content from this holder.
   * @param content The content to remove.
   */
  removeContent(content: GoogleAppsScript.XML_Service.Content): void;

  /**
   * Validate the insertion of content into the holder.
   * @param content The content to insert.
   * @param index The index at which to insert the content.
   * @param paramName The name of the parameter being validated.
   * @internal
   */
  _validateContentInsertion(
    content: GoogleAppsScript.XML_Service.Content,
    index: number,
    paramName: string
  ): void;
}
