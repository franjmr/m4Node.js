import * as fs from "fs";
import { M4NodeJS } from "../m4nodejs";

async function exampleMock(){
    const m4NodeJS = new M4NodeJS("http://jonsnow:13020");
    await m4NodeJS.load();
    
    const m4ObjectId = "PLCO_LOAD_ALL_PERSONAL_INFO";
    const m4MetadataMock = fs.readFileSync("./__mocks__/metadata/"+m4ObjectId+".xml", 'utf8');
    
    m4NodeJS.mock.initialize();
    m4NodeJS.mock.setM4ObjectMetadata(m4ObjectId, m4MetadataMock);

    const m4ObjectMock = await m4NodeJS.createM4Object(m4ObjectId);
    console.log("Mocked M4Object: ".concat(m4ObjectMock.getId()));

    m4NodeJS.mock.finalize();
}

exampleMock();