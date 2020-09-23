import { M4NodeJS } from "../m4nodejs";

const server = "http://jonsnow:13020";
const user = "JCM_ESS";
const pass = "123";

async function example(){
    const m4NodeJS = new M4NodeJS(server);
    await m4NodeJS.load();
    const logon = await m4NodeJS.logon(user,pass);

    if(!logon.getToken()){
        return;
    }

    m4NodeJS.debug.enableConsoleMessages();

    await m4NodeJS.loadMetadata(['PLCO_LOAD_ALL_PERSONAL_INFO']);
    const requestResult = await m4NodeJS.executeMethod("PLCO_LOAD_ALL_PERSONAL_INFO", "PLCO_PERSONAL_EMPLOYEE_INFORMT", "PLCO_LOAD_ALL_PERSONAL_INFO", ["","",""]);

    const requestObject = requestResult.getObject();
    if( requestObject ){
        const requestNode = requestObject.getNode("PSCO_EMPLOYEE_RECORD_HEADER");
        const requestNodeValue = requestNode.getValue("PSCO_EMPLOYEE_NAME");
        console.log("Hi "+requestNodeValue+ "!");
    }
    
    await m4NodeJS.logout();

    console.log("All done!")
}

example();