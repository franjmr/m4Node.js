const jsapiServer = 'http://franciscocaw10.meta4.com:5020/' ;
const usr = "ORLIEMOBILE";
const pwd = "RUN";

const M4ApiNode = require('./m4apiNode');

const m4apiNode = new M4ApiNode(jsapiServer,usr,pwd);

m4apiNode.initialize().then( async ()=>{
    await m4apiNode.logonPromise();
    await m4apiNode.loadMetadataPromise(['PSCO_WDG_MY_TASKS']);
    const request = await m4apiNode.executeMethodPromise("PSCO_WDG_MY_TASKS", "PSCO_WDG_MY_TASKS", "PLCO_LOAD", [null]);
    const objRequest = request.getObject();
    if(objRequest){
        const nodeRequest = objRequest.getNode("PSCO_WDG_FUNC_PROCESSES");
        console.log("Method executed ok! Number of records is: " + nodeRequest.count());
    }
    await m4apiNode.logoutPromise();
    console.log("All done!")
});