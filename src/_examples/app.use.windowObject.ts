import { M4NodeJS } from "../m4nodejs";
import { M4Object } from "../m4Interfaces/M4Object";

const server = "http://jonsnow:13020";
const user = "JCM_ESS";
const pass = "123";

const M4_OBJECT_ID = "PLCO_LOAD_ALL_PERSONAL_INFO";
const M4_NODE_ID = "PLCO_PERSONAL_EMPLOYEE_INFORMT";
const M4_METHOD_ID = "PLCO_LOAD_ALL_PERSONAL_INFO";

async function example(){
    const m4NodeJS = new M4NodeJS(server);
    await m4NodeJS.load();
    const logon = await m4NodeJS.logon(user,pass);

    if(!logon.getToken()){
        return;
    }

    const _window = m4NodeJS.getWindow();

    await m4NodeJS.loadMetadata([M4_OBJECT_ID]);

    const t3js = new _window.meta4.M4Object(M4_OBJECT_ID);
    const args = ["","",""];
    
    const requestResult = await m4NodeJS.executeM4ObjectMethod(t3js, M4_NODE_ID, M4_METHOD_ID, args);

    const requestObject = requestResult.getObject();
    const requestNode = requestObject.getNode("PSCO_EMPLOYEE_RECORD_HEADER");
    const requestNodeValue = requestNode.getValue("PSCO_EMPLOYEE_NAME");
    
    console.log("Hi "+requestNodeValue+ "!");
    
    await m4NodeJS.logout();

    console.log("All done!")
}

example();