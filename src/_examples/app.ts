import { M4ApiNode } from "../m4apiNode";

const server = "http://franciscocaw10.meta4.com:5020";
const user01 = "NOMINAM";
const pass01 = "123";
const user02 = "ORLIEMOBILE";
const pass02 = "RUN";

async function example(){
    
    // Create Instances
    const m4apiNode01 = new M4ApiNode(server,user01,pass01);
    const m4apiNode02= new M4ApiNode(server,user02,pass02);

    // Initialize instances
    await m4apiNode01.initializeAsync();
    await m4apiNode02.initializeAsync();

    // Logon Instances
    const logonToken01 = await m4apiNode01.logonPromise();
    const logonToken02 = await m4apiNode02.logonPromise();

    console.log("User 01 token: "+logonToken01);
    console.log("User 01 token: "+logonToken02);

    // Execute Instance 01
    await m4apiNode01.loadMetadataPromise(['PLCO_LOAD_ALL_PERSONAL_INFO']);
    const request01 = await m4apiNode01.executeMethodPromise("PLCO_LOAD_ALL_PERSONAL_INFO", "PLCO_PERSONAL_EMPLOYEE_INFORMT", "PLCO_LOAD_ALL_PERSONAL_INFO", ["","",""]);
    const objRequest01 = request01.getObject();
    if( objRequest01 ){
        const nodeRequest01 = objRequest01.getNode("PSCO_EMPLOYEE_RECORD_HEADER");
        const nodeRequestValue01 = nodeRequest01.getValue("PSCO_EMPLOYEE_NAME");
        console.log("Execute 01 - Method executed ok! Number of records is: " + nodeRequest01.count());
        console.log("Execute 01 - Method executed ok! Value of records is: " + nodeRequestValue01);
        m4apiNode01.m4Store.getAllCookies((error,values) =>{
            console.log("============================ Execute 01 - Cookie Values ============================");
            console.log("Execute 01 - Cookie Values :"+ values.length);
            values.forEach((value) => {
                console.log(value.key + " - " +value.value);
            });
            console.log("====================================================================================");
        }); 
    }
    

    // Execute Instance 01
    await m4apiNode02.loadMetadataPromise(['PLCO_LOAD_ALL_PERSONAL_INFO']);
    const request02 = await m4apiNode02.executeMethodPromise("PLCO_LOAD_ALL_PERSONAL_INFO", "PLCO_PERSONAL_EMPLOYEE_INFORMT", "PLCO_LOAD_ALL_PERSONAL_INFO", ["","",""]);
    const objRequest02 = request02.getObject();
    if( objRequest02 ){
        const nodeRequest02 = objRequest02.getNode("PSCO_EMPLOYEE_RECORD_HEADER");
        const nodeRequestValue02 = nodeRequest02.getValue("PSCO_EMPLOYEE_NAME");
        console.log("Execute 02 - Method executed ok! Number of records is: " + nodeRequest02.count());
        console.log("Execute 02 - Method executed ok! Value of records is: " + nodeRequestValue02);
        m4apiNode02.m4Store.getAllCookies((error,values) =>{
            console.log("============================ Execute 02 - Cookie Values ============================");
            console.log("Execute 02 - Cookie Values :"+ values.length);
            values.forEach((value) => {
                console.log(value.key + " - " +value.value);
            });
            console.log("====================================================================================");
        });
    }

    // Logout instances
    await m4apiNode01.logoutPromise();
    await m4apiNode02.logoutPromise();

    console.log("All done!")
}

example();