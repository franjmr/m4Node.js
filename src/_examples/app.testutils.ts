import { TestUtils } from "../testUtils";

async function exampleMock(){
    const m4TestUtils = new TestUtils();
    await m4TestUtils.createXmlMetadataFile("http://jonsnow.meta4.com:13020", "JCM_ESS", "123", "PLCO_LOAD_ALL_PERSONAL_INFO","C:/Temp");
}

exampleMock();