import { M4ApiNode } from "../m4apiNode";
import { M4Node } from "../m4Interfaces/M4Node";

const server = "http://arya.meta4.com:5020";
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
    const logonResult01 = await m4apiNode01.logonPromise();
    const logonResult02 = await m4apiNode02.logonPromise();

    console.log("User 01 token: "+logonResult01.getToken());
    console.log("User 02 token: "+logonResult02.getToken());

    // Execute Instance 01
    await m4apiNode01.loadMetadataPromise(['PLCO_LOAD_ALL_PERSONAL_INFO']);
    const request01 = await m4apiNode01.executeMethodPromise("PLCO_LOAD_ALL_PERSONAL_INFO", "PLCO_PERSONAL_EMPLOYEE_INFORMT", "PLCO_LOAD_ALL_PERSONAL_INFO", ["","",""]);
    const objRequest01 = request01.getObject();
    if( objRequest01 ){
        const nodeRequest01 = objRequest01.getNode("PSCO_EMPLOYEE_RECORD_HEADER");
        const nodeRequestValue01 = nodeRequest01.getValue("PSCO_EMPLOYEE_NAME");
        console.log("Execute 01 - Method executed ok! Number of records is: " + nodeRequest01.count());
        console.log("Execute 01 - Method executed ok! Value of records is: " + nodeRequestValue01);
        m4apiNode01.getCookieStore().getAllCookies((error,values) =>{
            console.log("============================ Execute 01 - Cookie Values ============================");
            console.log("Execute 01 - Cookie Values :"+ values.length);
            values.forEach((value) => {
                console.log(value.key + " - " +value.value);
            });
            console.log("====================================================================================");
        }); 
    }
    

    // Execute Instance 02
    await m4apiNode02.loadMetadataPromise(['PLCO_LOAD_ALL_PERSONAL_INFO']);
    const request02 = await m4apiNode02.executeMethodPromise("PLCO_LOAD_ALL_PERSONAL_INFO", "PLCO_PERSONAL_EMPLOYEE_INFORMT", "PLCO_LOAD_ALL_PERSONAL_INFO", ["","",""]);
    const objRequest02 = request02.getObject();
    if( objRequest02 ){
        const nodeRequest02 = objRequest02.getNode("PSCO_EMPLOYEE_RECORD_HEADER");
        const nodeRequestValue02 = nodeRequest02.getValue("PSCO_EMPLOYEE_NAME");
        console.log("Execute 02 - Method executed ok! Number of records is: " + nodeRequest02.count());
        console.log("Execute 02 - Method executed ok! Value of records is: " + nodeRequestValue02);
        m4apiNode02.getCookieStore().getAllCookies((error,values) =>{
            console.log("============================ Execute 02 - Cookie Values ============================");
            console.log("Execute 02 - Cookie Values :"+ values.length);
            values.forEach((value) => {
                console.log(value.key + " - " +value.value);
            });
            console.log("====================================================================================");
        });
    }

    // Observable
    console.log("============================ Observables ============================");
    const m4node = request02.getObject().getNode("PSCO_EMPLOYEE_RECORD_HEADER");
    const m4NodeObservable = m4apiNode02.createObservableByNodeItemChanged(m4node);
    const m4EmployeName = m4node.getValue("PSCO_EMPLOYEE_NAME");
    console.log('EMPLOYE NAME before subscribe '+m4EmployeName);

    m4NodeObservable.subscribe({
        next(node:M4Node) { console.log('Observale - New value: ' + node.getValue("PSCO_EMPLOYEE_NAME")); },
        error(err) { console.error('Observale - something wrong occurred: ' + err); },
        complete() { console.log('Observale - done'); }
    });

    console.log('EMPLOYE NAME after subscribe...');
    m4node.setValue("PSCO_EMPLOYEE_NAME","Jin Kazama");

    // END EXAMPLES

    // Logout instances
    await m4apiNode01.logoutPromise();
    await m4apiNode02.logoutPromise();

    console.log("All done!")
}

example();