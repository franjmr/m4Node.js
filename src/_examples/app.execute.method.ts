import { M4NodeJS } from "../m4nodejs";
import { M4LogonResult } from "../m4Interfaces/M4LogonResult";
import { M4Request } from "../m4Interfaces/M4Request";
import { M4Object } from "../m4Interfaces/M4Object";
import { M4Node } from "../m4Interfaces/M4Node";

const server:string = "http://jonsnow:13020";
const user:string = "JCM_ESS";
const pass:string = "123";

/**
 * Execute Node method from a M4Request instance with M4Nodejs
 */
async function exampleExecuteMethod():Promise<void> {
    const m4NodeJS:M4NodeJS = new M4NodeJS(server);
    await m4NodeJS.load();
    const logon:M4LogonResult  = await m4NodeJS.logon(user,pass);

    if(!logon.getToken()){
        return;
    }

    m4NodeJS.debug.enableConsoleMessages();

    await m4NodeJS.loadMetadata(['PLCO_LOAD_ALL_PERSONAL_INFO']);
    const requestResult:M4Request = await m4NodeJS.executeMethod("PLCO_LOAD_ALL_PERSONAL_INFO", "PLCO_PERSONAL_EMPLOYEE_INFORMT", "PLCO_LOAD_ALL_PERSONAL_INFO", ["","",""]);
    
    const m4Object:M4Object = requestResult.getObject();  
    const m4Node:M4Node = m4Object.getNode("PSCO_EMPLOYEE_RECORD_HEADER");
    const employeeName:string = m4Node.getValue("PSCO_EMPLOYEE_NAME");
    
    console.log("Hi "+employeeName+ "!");
    
    await m4NodeJS.logout();

    console.log("All done!")
}

exampleExecuteMethod();