import { FakeXmlService } from "./FakeXmlService";

(() => {
  globalThis.XmlService = new FakeXmlService();
})();
