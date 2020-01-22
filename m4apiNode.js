const jsdom = require("jsdom");
const requireFromUrlSync = require('require-from-url/sync');
const { JSDOM } = jsdom;
const baseFile = "/m4jsapi_node/m4jsapi_node.nocache.js";
const Rx = require('rxjs');

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

    setM4Executor(m4Executor){
        this.m4Executor = m4Executor;
    }

    getM4Executor(){
        return this.m4Executor;
    }

    async initialize(){
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

        function loadM4Library(){
            return new Promise((resolve) => { 
                window.meta4OnLoad = function meta4OnLoad() {
                    console.log("jsapi loaded!");
                    resolve();
                }
            });
        }

        function createM4Executor(server){
            window.meta4.M4Executor.setServiceBaseUrl(server);
            return new window.meta4.M4Executor()
        }

        await loadM4Library();
        const m4Executor = createM4Executor(this.server);
        this.setM4Executor(m4Executor);
    }

    logonPromise(){
        const _m4Executor = this.m4Executor;
        const _user = this.user;
        const _pass = this.pass;
        return new Promise((resolve, reject) => { 
            console.log("doing logon...");
            _m4Executor.logon(_user, _pass, "2", 
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
        const _m4Executor = this.m4Executor;
        return new Promise((resolve,reject) => { 
            console.log("executing logout");
            _m4Executor.logout(
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