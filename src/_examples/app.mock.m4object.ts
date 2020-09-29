import * as fs from "fs";
import { M4NodeJS } from "../m4nodejs";
import { M4Object } from "../m4Interfaces/M4Object";
import { M4NodeJsFactory } from "..";

const server:string = "http://jonsnow:13020";

/**
 * Create M4Objects instances from an XML Metadata definition without M4JSAPI logon
 */
async function exampleMock():Promise<void> {
  const m4NodeJS:M4NodeJS = await M4NodeJsFactory.newInstance(server);

  const m4ObjectId: string = "PLCO_LOAD_ALL_PERSONAL_INFO";
  const xmlMetadataPath: string = "./__mocks__/metadata/".concat(m4ObjectId).concat(".xml");
  
  const m4MetadataMock: string = fs.readFileSync(
    xmlMetadataPath,
    "utf8"
  );

  m4NodeJS.mock.initialize();
  m4NodeJS.mock.setM4ObjectMetadata(m4ObjectId, m4MetadataMock);

  const mockM4Object: M4Object = await m4NodeJS.createM4Object(m4ObjectId);
  console.log("Mocked M4Object: ".concat(mockM4Object.getId()));

  m4NodeJS.mock.finalize();
}

exampleMock();
