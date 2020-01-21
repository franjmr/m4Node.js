const jsapiServer = 'http://franciscocaw10.meta4.com:5020/' ;
const usr = "ORLIEMOBILE";
const pwd = "RUN";

const M4ApiNode = require('./m4apiNode');

const m4apiNode = new M4ApiNode(jsapiServer,usr,pwd);

m4apiNode.waitForMeta4OnLoad().then((value) =>{
    if(value){
        m4apiNode.start();
    }
});