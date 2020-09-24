import { TestUtils } from "../testUtils";

/**
 * Create an XML file in a directory with the M4Object metadata content
 */
async function exampleMock():Promise<void> {
  const m4TestUtils: TestUtils = new TestUtils();
  await m4TestUtils.createXmlMetadataFile(
    "http://jonsnow.meta4.com:13020",
    "JCM_ESS",
    "123",
    "PLCO_LOAD_ALL_PERSONAL_INFO",
    "C:/Temp"
  );
}

exampleMock();
