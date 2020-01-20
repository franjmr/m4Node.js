const jsdom = require("jsdom");
const { JSDOM } = jsdom;

//const jsapiServer = 'http://sirius.meta4.com:43020' ;
const jsapiServer = 'http://eduardoferw7:8080' ;
const usr = "JCM_ESS";
const pwd = "123";

const baseFile = "/m4jsapi_node/m4jsapi_node.nocache.js";

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

// hook to define the module base url
// var key = '__gwtDevModeHook:m4jsapi:moduleBase';
// window[key] = "http://localhost";

async function start() {
    
    function load() { return new Promise((resolve) => { 
        window.meta4OnLoad = function meta4OnLoad() {
            console.log("jsapi loaded!");
            resolve();
        }
    })};

    function logon () { return new Promise((resolve) => { 

        console.log("doing logon...");
        
        window.meta4.M4Executor.setServiceBaseUrl(jsapiServer);

        let ex = new window.meta4.M4Executor();
    
        ex.logon(usr, pwd, "2", 
            (x) => {
                if (!x.getResult()) {
                    console.log("Logon didn't work");
                }
                else {
                    console.log("ok! Logon Token = " + x.getResult().getToken())
                }
                resolve();
            }, 
            (x) => {
                console.log("error: " + x);
                resolve();
            }
        );
    }) };

    function loadMetadata () { return new Promise((resolve) => { 

        console.log("loading metadata");
        
        let ex = new window.meta4.M4Executor();

        ex.loadMetadata(['PSCO_WDG_MY_TASKS'], 
            (x) => {
                console.log("Metadata loaded ok!");
                resolve();
            }, 
            (x) => {
                console.log("error: Loading metadata: " + x);
                resolve();
            }
        );
    }) };

    function executeMethod () { return new Promise((resolve) => { 

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
                resolve();
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
                resolve();
            }
        );
    }) };

    load().then(logon).then(loadMetadata).then(executeMethod).then(logout).then(() => {
        console.log("All done")
    });

}

var requireFromUrl = require('require-from-url/sync');
requireFromUrl(jsapiServer + baseFile);

start();

