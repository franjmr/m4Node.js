import jsdom = require("jsdom");
import requireFromUrlSync = require('require-from-url/sync');
import rxjs = require('rxjs');
import { M4Executor } from './m4Interfaces/M4Executor';
import { M4Request } from './m4Interfaces/M4Request';

const { JSDOM } = jsdom;
const baseFile = "/m4jsapi_node/m4jsapi_node.nocache.js";

declare global {
    namespace NodeJS {
        interface Global {
            document: Document;
            window: Window;
            navigator: Navigator;
            DOMParser: DOMParser;
        }
    }
}

declare global {
    interface Window {
        meta4: any;
        meta4OnLoad: any
    } 
}

export class M4ApiNode {

    server: string;
    user: string;
    pass: string;
    apiUrl: string;
    m4Executor: M4Executor

    /**
     * Constructor
     * @param {string} server
     * @param {string} user
     * @param {string} pass
     */
    constructor(server: string, user:string, pass:string) {
      this.server = server;
      this.user = user;
      this.pass = pass;
      this.apiUrl = server + baseFile
    }

    /**
     * Get M4Executor
     * @returns {M4Executor} m4Executor
     */
    getM4Executor(): M4Executor{
        if(!this.m4Executor){
            this.createM4Executor();
        }
        return this.m4Executor;
    }

    /**
     * Set M4Executor
     * @param {com.meta4.js.client.M4Executor} m4Executor
     */
    private setM4Executor(m4Executor: M4Executor){
        this.m4Executor = m4Executor;
    }


    /**
     * Resolve M4JSAPI is loaded in context
     * @returns {Promise}
     */
    private isM4JsapiLoaded(): Promise<boolean> {
        return new Promise((resolve) => { 
            window.meta4OnLoad = function meta4OnLoad() {
                console.log("M4JSAPI loaded!");
                resolve(true);
            }
        });
    }

    private createM4Executor(){
        window.meta4.M4Executor.setServiceBaseUrl(this.server);
        this.setM4Executor(new window.meta4.M4Executor());
    }

    async initializeAsync(){
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

        const bIsM4JsapiLoaded = await this.isM4JsapiLoaded();

        return bIsM4JsapiLoaded;
    }

    /**
     * Logon User
     * @returns {Promise}
     */
    logonPromise(): Promise<boolean>{
        const _m4Executor = this.getM4Executor();
        const _user = this.user;
        const _pass = this.pass;
        return new Promise((resolve, reject) => { 
            console.log("doing logon...");
            _m4Executor.logon(_user, _pass, "2", 
                (request: M4Request) => {
                    if (!request.getResult()) {
                        console.log("Logon didn't work");
                        resolve(false);
                    }
                    else {
                        // console.log("ok! Logon Token = " + request.getResult().getToken());
                        resolve(true);
                    }
                }, 
                (request: M4Request) => {
                    console.log("error: logon: " + request.getErrorException());
                    reject(request.getErrorException());
                }
            );
        });
    }

    /**
     * Logout User
     * @returns {Promise}
     */
    logoutPromise(): Promise<boolean>{
        const _m4Executor = this.getM4Executor();
        return new Promise((resolve) => { 
            console.log("executing logout");
            _m4Executor.logout(
                () => {
                    console.log("Logout done ok!");
                    resolve(true);
                }, 
                (request: M4Request) => {
                    console.log("error: logout: " + request.getErrorException());
                    resolve(false);
                }
            );
        });
    }

    /**
     * Load Metadata
     * @param {Array} m4objects 
     * @returns {Promise}
     */
    loadMetadataPromise(m4objects: string[]): Promise<boolean> { 
        const _m4Executor = this.getM4Executor();
        return new Promise((resolve,reject) => { 
            _m4Executor.loadMetadata(m4objects, 
                () => {
                    console.log("Metadata loaded ok!");
                    resolve(true);
                }, 
                (request: M4Request) => {
                    console.log("error: Loading metadata: " + request.getErrorException());
                    reject(false);
                }
            );
        }) 
    };

    /**
     * Execute method
     * @param {String} m4objectId 
     * @param {String} nodeId 
     * @param {String} methodId 
     * @param {String} methodArgs 
     * @returns {Promise} 
     */
    executeMethodPromise(m4objectId: string, nodeId: string, methodId: string, methodArgs: string[]): Promise<M4Request> { 
        const _m4Executor = this.getM4Executor();
        return new Promise((resolve) => { 
            const _obj = new window.meta4.M4Object(m4objectId);
            const _node = _obj.getNode(nodeId);
            const _request = new window.meta4.M4Request(_node.getObject(), _node.getId(), methodId, methodArgs);
            _m4Executor.execute(_request,
                (request: M4Request) => {
                    console.log("Method executed ok!");
                    resolve(request);
                }, 
                (request: M4Request) => {
                    console.log("error: Method executed: " + request.getErrorException());;
                    resolve();
                }
            );
        }) 
    };

    /**
     * Logon with RXHS
     */
    logonObservable(){
        const _logonObservable = rxjs.from(this.logonPromise());
        _logonObservable.subscribe( value => {
            console.log("Logon Observable Status: "+value);
        });
    };

    /**
     * Logout with RXHS
     */
    logoutObservable(){
        const _logoutObservable = rxjs.from(this.logoutPromise());
        _logoutObservable.subscribe( value => {
            console.log("Logout Observable Status: "+value);
        });
    }
}