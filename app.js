const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const jsapiServer = 'http://arya.meta4.com:5020' ;
const usr = "ORLIEMOBILE";
const pwd = "RUN";
//const baseFile = "/m4jsapi_node/m4jsapi_node.nocache.js";
const baseFile = "/m4jsapi/m4jsapi.nocache.js"
const apiUrl = jsapiServer.concat(baseFile);

const {window} = new JSDOM(``, {
    url: jsapiServer + baseFile,
    referrer: jsapiServer,
    contentType: "text/html",
    includeNodeLocations: true,
    storageQuota: 10000000
});

// const Window = require('window');
// global.window = new Window();
global.window = window;
global.document = window.document;
global.navigator = window.navigator;
global.DOMParser = window.DOMParser;

async function start() {
    
    function load() { return new Promise((resolve) => { 
        window.meta4OnLoad = function meta4OnLoad() {
            console.log("jsapi loaded!");
            resolve();
        }
    })};

    function logon () { return new Promise((resolve, reject) => { 
        console.log("doing logon...");
        window.meta4.M4Executor.setServiceBaseUrl(jsapiServer);
        let ex = new window.meta4.M4Executor();
        ex.logon(usr, pwd, "2", 
            (x) => {
                if (!x.getResult()) {
                    console.log("Logon didn't work");
                    reject();
                }
                else {
                    console.log("ok! Logon Token = " + x.getResult().getToken());
                    resolve();
                }
            }, 
            (x) => {
                console.log("error: " + x);
                reject();
            }
        );
    }) };

    function loadMetadata () { return new Promise((resolve,reject) => { 
        console.log("loading metadata");
        let ex = new window.meta4.M4Executor();
        ex.loadMetadata(['PSCO_WDG_MY_TASKS'], 
            (x) => {
                console.log("Metadata loaded ok!");
                resolve();
            }, 
            (x) => {
                console.log("error: Loading metadata: " + x);
                reject();
            }
        );
    }) };

    function executeMethod () { return new Promise((resolve,reject) => { 
        console.log("executing method");
        let obj = new window.meta4.M4Object("PSCO_WDG_MY_TASKS");
		let	node = obj.getNode("PSCO_WDG_MY_TASKS");
        let req = new window.meta4.M4Request(node.getObject(), node.getId(), "PLCO_LOAD", [null]);
        let ex = new window.meta4.M4Executor();
		ex.execute(req,
            (x) => {
                let currentNode = obj.getNode("PSCO_WDG_FUNC_PROCESSES");
                console.log("Method executed ok! Number of records is: " + currentNode.count());
                resolve(node);
            }, 
            (x) => {
                console.log("error: Method executed: " + x);
                reject();
            }
        );
    }) };

    function logout () { return new Promise((resolve) => { 
        console.log("executing logout");
        let ex = new window.meta4.M4Executor();
		ex.logout(
            (x) => {
                console.log("Logout done ok!");
                resolve();
            }, 
            (x) => {
                console.log("error: logout: " + x);
                reject();
            }
        );
    }) };

    load().then(logon).then(loadMetadata).then(executeMethod).then(logout).then(() => {
        console.log("All done");
    });

}

try{
    const requireFromUrlSync = require('require-from-url/sync');
    const listener = require('require-from-url/addLoadListener');
    
    requireFromUrlSync(apiUrl);
    listener(apiUrl, function(){
        console.log("Loaded!");
        start();
    });

}catch(error){
    console.error("Error loading api from url "+apiUrl);
    console.error(error);
}