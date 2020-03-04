import { M4ApiNode } from "../m4apiNode";
import * as fs from "fs";

async function exampleMock(){
    
    // Create Instances
    const m4apiNode = new M4ApiNode("http://arya.meta4.com:5020","notExists","foo");

    // Initialize instances
    await m4apiNode.initializeAsync();

    // Mock M4JSAPI
    const _metadataM4ObjPersonalInfo = fs.readFileSync("./__mocks__/metadata/PLCO_LOAD_ALL_PERSONAL_INFO.xml", 'utf8');

    m4apiNode.__mock__initialize__();
    m4apiNode.__mock__setM4ObjectMetadata__("PLCO_LOAD_ALL_PERSONAL_INFO",_metadataM4ObjPersonalInfo);

    const m4ObjectMock = await m4apiNode.createM4Object("PLCO_LOAD_ALL_PERSONAL_INFO");
    console.log("Mocked M4Object: "+m4ObjectMock.getId());

    m4apiNode.__mock__finalize__();
}

exampleMock();