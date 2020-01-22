const jsdom = require("jsdom");
const requireFromUrlSync = require('require-from-url/sync');
const { JSDOM } = jsdom;
const baseFile = "/m4jsapi_node/m4jsapi_node.nocache.js";

class M4ApiNode {

    /**
     * 
     * @param {string} server 
     * @param {string} user 
     * @param {string} pass 
     */
    constructor(server, user, pass) {
      this.server = server;
      this.user = user;
      this.pass = pass;
      this.apiUrl = server + baseFile
    }

    
    initialize(){
        const { window } = new JSDOM(``, {
            url: this.apiUrl,
            referrer: this.server,
            contentType: "text/html",
            includeNodeLocations: true,
            storageQuota: 10000000
        });
        
        global.window = window;
        global.document = window.document;
        global.navigator = window.navigator;
        global.DOMParser = window.DOMParser;

        requireFromUrlSync(this.apiUrl);

        return new Promise((resolve) => { 
            window.meta4OnLoad = function meta4OnLoad() {
                console.log("jsapi loaded!");
                resolve();
            }
        });
    }

    async start() {
    
        function logon (server,user,pass) { return new Promise((resolve, reject) => { 
            console.log("doing logon...");
            console.log("Server "+server);
            console.log("User "+user);
            console.log("Pass "+pass);
            window.meta4.M4Executor.setServiceBaseUrl(server);
            let ex = new window.meta4.M4Executor();
            ex.logon(user, pass, "2", 
                (x) => {
                    if (!x.getResult()) {
                        console.log("Logon didn't work");
                        reject("Logon didn't work");
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
        
        function logout () { return new Promise((resolve,reject) => { 
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
    
        //await load();
        await logon(this.server,this.user,this.pass);
        await logout();
    }
}

module.exports = M4ApiNode;