const jsapiServer = 'http://franciscocaw10.meta4.com:5020/' ;
const usr = "ORLIEMOBILE";
const pwd = "RUN";

const M4ApiNode = require('./m4apiNode');

const m4apiNode = new M4ApiNode(jsapiServer,usr,pwd);

async function startM4ApiNode(){
    await m4apiNode.initialize();
    
    m4apiNode.logonPromise().then(m4apiNode.logoutPromise).then(()=>{
        console.log("All done");
    });

};

startM4ApiNode();