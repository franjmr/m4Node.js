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
      this.m4Executor = null;
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

    logonPromise(){
        const _this = this;
        return new Promise((resolve, reject) => { 
            console.log("doing logon...");
            window.meta4.M4Executor.setServiceBaseUrl(_this.server);
            let ex = new window.meta4.M4Executor();
            ex.logon(_this.user, _this.pass, "2", 
                (request) => {
                    if (!request.getResult()) {
                        console.log("Logon didn't work");
                        reject("Logon didn't work");
                    }
                    else {
                        console.log("ok! Logon Token = " + request.getResult().getToken());
                        resolve();
                    }
                }, 
                (request) => {
                    console.log("error: logon: " + request.getErrorException());
                    reject();
                }
            );
        });
    }

    logoutPromise(){
        return new Promise((resolve,reject) => { 
            console.log("executing logout");
            let ex = new window.meta4.M4Executor();
            ex.logout(
                () => {
                    console.log("Logout done ok!");
                    resolve();
                }, 
                (request) => {
                    console.log("error: logout: " + request.getErrorException());
                    reject();
                }
            );
        });
    }

}

module.exports = M4ApiNode;