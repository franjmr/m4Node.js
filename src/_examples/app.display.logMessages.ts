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
    
    try{
        await m4NodeJS.loadMetadata(['NON_EXISTING_META4OBJECT']);
    }catch(error){
        const errorMsg = error.getErrorMessage()
        console.error("LoadMetadata - Error by Non Existing M4Object: "+errorMsg);
    }

    try{
        const window = m4NodeJS.getWindow();

        await m4NodeJS.loadMetadata(["PLCO_LOAD_ALL_PERSONAL_INFO"]);
        const t3js = new window.meta4.M4Object("PLCO_LOAD_ALL_PERSONAL_INFO");
        const args = ["","",""];
        
        await m4NodeJS.executeM4ObjectMethod(t3js, "PLCO_PERSONAL_EMPLOYEE_INFORMT", "NON_EXISTING_METHOD", args);
    }catch(error){
        console.error("Execute Request - Error by Non Existing Method: "+error.toString());
    }
    
    await m4NodeJS.logout();

    console.log("All done!")
}

example();