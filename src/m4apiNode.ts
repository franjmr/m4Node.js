import jsdom = require("jsdom");
import requireFromUrl = require('require-from-url/async');
import rxjs = require('rxjs');
import { M4Executor } from './m4Interfaces/M4Executor';
import { M4Request } from './m4Interfaces/M4Request';
import memstore = require("tough-cookie/lib/memstore.js");
import tough = require('tough-cookie');

const { JSDOM } = jsdom;
const baseFile = "/m4jsapi_node/m4jsapi_node.nocache.js";

declare global {
    namespace NodeJS {
        interface Global {
            M4nodejs: Map<string, any>
            document: Document;
            window: Window;
            navigator: Navigator;
            DOMParser: DOMParser;
        }
    }
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
    m4Executor: M4Executor;
    m4Window : any;
    m4Store: tough.MemoryCookieStore;
    m4CookieStore: tough.CookieJar;

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
      this.apiUrl = server + baseFile;
      this.m4Store = new memstore.MemoryCookieStore();
      this.m4CookieStore = new tough.CookieJar(this.m4Store);
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

    private getWindow(){
        return this.m4Window;
    }

    private createM4Executor(){
        const localWindow = this.getWindow();
        localWindow.meta4.M4Executor.setServiceBaseUrl(this.server);
        this.setM4Executor(new localWindow.meta4.M4Executor());
    }

    async initializeAsync(){
        let alreadyLoaded = false;

        const { window } = new JSDOM(``, {
            url: this.apiUrl,
            referrer: this.server,
            contentType: "text/html",
            includeNodeLocations: true,
            storageQuota: 10000000,
            cookieJar: this.m4CookieStore
        });

        this.m4Window = window;

        if(!global.M4nodejs){
            console.log("M4JSAPI Initial Load!");
            global.M4nodejs = new Map<string,any>();
        }else{
            console.log("M4JSAPI Already loaded!");
            alreadyLoaded = true;
        }

        const m4NodeJs = {
            window: this.m4Window,
            document: this.m4Window.document,
            navigator: this.m4Window.navigator,
            DOMParser: this.m4Window.DOMParser
        }
        
        global.M4nodejs.set(this.user, m4NodeJs)

        if(alreadyLoaded === false) {
            global.window = m4NodeJs.window;
            global.document = m4NodeJs.document;
            global.navigator = m4NodeJs.navigator;
            global.DOMParser = m4NodeJs.DOMParser;

            await requireFromUrl([this.apiUrl]);

            const bIsM4JsapiLoaded = await this.isM4JsapiLoaded();

            return bIsM4JsapiLoaded;
        }else{
            console.log("Loading global Meta4...");
            m4NodeJs.window = Object.assign({}, global.window);
            this.m4Window = m4NodeJs.window;
            return true;
        }
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
            console.log("doing logon with user "+_user);
            _m4Executor.logon(_user, _pass, "2", 
                (request: M4Request) => {
                    if (!request.getResult()) {
                        console.log("Logon didn't work");
                        resolve(false);
                    }
                    else {
                        console.log("ok! Logon Token = " + request.getResult().getToken());
                        resolve(true);
                    }
                }, 
                (request: M4Request) => {
                    console.log("error: logon: " + request.getErrorException());
                    console.log("error msg: logon "+ request.getErrorMessage());
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
        const _localWindow = this.getWindow();
        return new Promise((resolve) => { 
            const _obj = new _localWindow.meta4.M4Object(m4objectId);
            const _node = _obj.getNode(nodeId);
            const _request = new _localWindow.meta4.M4Request(_node.getObject(), _node.getId(), methodId, methodArgs);
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