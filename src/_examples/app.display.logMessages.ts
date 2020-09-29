import { M4NodeJS } from "../m4nodejs";
import { M4Object } from "../m4Interfaces/M4Object";

const server:string = "http://jonsnow:13020";
const user:string = "JCM_ESS";
const pass:string = "123";

/**
 * Enable Console Messages: show m4jsapi errors by console
 */
async function exampleDisplayLogMsg():Promise<void> {
    const m4NodeJS: M4NodeJS = new M4NodeJS(server);
    await m4NodeJS.load();
    await m4NodeJS.logon(user,pass);

    m4NodeJS.debug.enableConsoleMessages();
    
    try{
        await m4NodeJS.loadMetadata(['NON_EXISTING_META4OBJECT']);
    }catch(error){
        const errorMsg: string = error.getErrorMessage();
        console.error("LoadMetadata - Error by Non Existing M4Object: "+errorMsg);
    }

    try{
        const m4Object: M4Object = await m4NodeJS.createM4Object("PLCO_LOAD_ALL_PERSONAL_INFO");
        const args: string[] = ["","",""];
        await m4NodeJS.executeM4ObjectMethod(m4Object, "PLCO_PERSONAL_EMPLOYEE_INFORMT", "NON_EXISTING_METHOD", args);
    }catch(error){
        const errorMsg: string = error.toString();
        console.error("Execute Request - Error by Non Existing Method: "+errorMsg);
    }
    
    await m4NodeJS.logout();

    console.log("All done!")
}

exampleDisplayLogMsg();