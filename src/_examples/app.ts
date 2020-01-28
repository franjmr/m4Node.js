import { M4ApiNode } from "../m4apiNode";

const server = "http://franciscocaw10.meta4.com:5020";
const user = "ORLIEMOBILE";
const pass = "RUN";

async function example(){
    const m4apiNode = new M4ApiNode(server,user,pass);
    await m4apiNode.initializeAsync();
    await m4apiNode.logonPromise();
    await m4apiNode.loadMetadataPromise(['PSCO_WDG_MY_TASKS']);
    const request = await m4apiNode.executeMethodPromise("PSCO_WDG_MY_TASKS", "PSCO_WDG_MY_TASKS", "PLCO_LOAD", [null]);
    const objRequest = request.getObject();
    if( objRequest ){
        const nodeRequest = objRequest.getNode("PSCO_WDG_FUNC_PROCESSES");
        console.log("Method executed ok! Number of records is: " + nodeRequest.count());
    }
    await m4apiNode.logoutPromise();
    console.log("All done!")
}

example();