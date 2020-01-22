const jsdom = require("jsdom");
const requireFromUrlSync = require('require-from-url/sync');
const { JSDOM } = jsdom;
const baseFile = "/m4jsapi_node/m4jsapi_node.nocache.js";
const rxjs = require('rxjs');

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
                        resolve(false);
                    }
                    else {
                        console.log("ok! Logon Token = " + request.getResult().getToken());
                        resolve(true);
                    }
                }, 
                (request) => {
                    console.log("error: logon: " + request.getErrorException());
                    reject(request.getErrorException());
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
                    resolve(true);
                }, 
                (request) => {
                    console.log("error: logout: " + request.getErrorException());
                    reject();
                }
            );
        });
    }

    loadMetadataPromise(m4objects) { 
        const _m4Executor = this.getM4Executor();
        return new Promise((resolve,reject) => { 
            _m4Executor.loadMetadata(m4objects, 
                () => {
                    console.log("Metadata loaded ok!");
                    resolve();
                }, 
                (request) => {
                    console.log("error: Loading metadata: " + request.getErrorException());
                    reject();
                }
            );
        }) 
    };

    executeMethodPromise(m4objectId, nodeId, methodId, methodArgs) { 
        const _m4Executor = this.getM4Executor();
        return new Promise((resolve) => { 
            let obj = new window.meta4.M4Object(m4objectId);
            let	node = obj.getNode(nodeId);
            let req = new window.meta4.M4Request(node.getObject(), node.getId(), methodId, methodArgs);
            _m4Executor.execute(req,
                (request) => {
                    console.log("Method executed ok!");
                    resolve(request);
                }, 
                (request) => {
                    console.log("error: Method executed: " + request.getErrorException());;
                    resolve();
                }
            );
        }) 
    };


    //RXJS Observables
    logonObservable(){
        const _logonObservable = rxjs.from(this.logonPromise());
        _logonObservable.subscribe( value => {
            console.log("Logon Observable Status: "+value);
        });
    };

    logoutObservable(){
        const _logoutObservable = rxjs.from(this.logoutPromise());
        _logoutObservable.subscribe( value => {
            console.log("Logout Observable Status: "+value);
            this.logonStatus = value;
        });
    }

}

module.exports = M4ApiNode;