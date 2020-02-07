import jsdom = require("jsdom");
import rxjs = require('rxjs');
import { M4Executor } from './m4Interfaces/M4Executor';
import { M4Request } from './m4Interfaces/M4Request';
import tough = require('tough-cookie');
import http = require('http');
import vm  = require('vm');
import concat = require('concat-stream');
import { M4Node } from "./m4Interfaces/M4Node";

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
      this.m4Store = new tough.MemoryCookieStore();
      this.m4CookieStore = new tough.CookieJar(this.m4Store);
    }

    /**
     * Get M4Executor
     * @returns {M4Executor} m4Executor
     */
    private getM4Executor(): M4Executor{
        global.window = null;
        if(!this.m4Executor){
            this.createM4Executor();
        }
        return this.m4Executor;
    }

    /**
     * Import M4JSAPI from apiUrl property
     */
    private importM4Jsapi(){
        console.log("Loading M4JSAPI from url: "+this.apiUrl);
        const apiUrl = this.apiUrl;
        return new Promise((resolve) => { 
            http.get( apiUrl, (res) => {
                res.setEncoding('utf8');
                res.pipe(concat({ encoding: 'string' }, (remoteSrc) => {
                  vm.runInThisContext(remoteSrc, 'remote_modules/m4jsapi_node.js');
                  resolve(true);
                }));
            });
        });
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
        const { window } = new JSDOM(``, {
            url: this.apiUrl,
            referrer: this.server,
            contentType: "text/html",
            includeNodeLocations: true,
            storageQuota: 10000000,
            cookieJar: this.m4CookieStore
        });

        this.m4Window = window;

        console.log("M4JSAPI Initial Load!");
        global.window = this.m4Window;
        global.document = this.m4Window.document;
        global.navigator = this.m4Window.navigator;
        global.DOMParser = this.m4Window.DOMParser;

        await this.importM4Jsapi();

        const bIsM4JsapiLoaded = await this.isM4JsapiLoaded();
        return bIsM4JsapiLoaded;
    }

    /**
     * Logon User
     */
    logonPromise(): Promise<string>{
        const _m4Executor = this.getM4Executor();
        const _user = this.user;
        const _pass = this.pass;
        return new Promise((resolve, reject) => { 
            console.log("Doing logon with user: "+_user+"...");
            _m4Executor.logon(_user, _pass, "2", 
                (request: M4Request) => {
                    if (!request.getResult()) {
                        console.log("Logon didn't work");
                        reject();
                    }else {
                        const logonToken = request.getResult().getToken();
                        console.log("Logon Success! Token = " + logonToken);
                        resolve(logonToken);
                    }
                }, 
                (request: M4Request) => {
                    console.log("Error - logon: " + request.getErrorException());
                    console.log("Error message logon: "+ request.getErrorMessage());
                    reject(request.getErrorException());
                }
            );
        });
    }

    /**
     * Logout User
     */
    logoutPromise(): Promise<boolean>{
        const _m4Executor = this.getM4Executor();
        return new Promise((resolve) => { 
            console.log("Executing logout...");
            _m4Executor.logout(
                () => {
                    console.log("Logout done ok!");
                    resolve(true);
                }, 
                (request: M4Request) => {
                    console.log("Error logout: " + request.getErrorException());
                    resolve(false);
                }
            );
        });
    }

    /**
     * Load Metadata
     * @param {Array} m4objects 
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
                    console.log("Error loading metadata: " + request.getErrorException());
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
     */
    executeMethodPromise(m4objectId: string, nodeId: string, methodId: string, methodArgs: any[]): Promise<M4Request> { 
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
    logonObservable(): rxjs.Observable<string>{
        const _logonObservable = rxjs.from(this.logonPromise());
        return _logonObservable;
    };

    /**
     * Logout with RXHS
     */
    logoutObservable(): rxjs.Observable<boolean>{
        const _logoutObservable = rxjs.from(this.logoutPromise());
        return _logoutObservable;
    }

    /**
     * Execute method with RXHS
     * @param m4objectId 
     * @param nodeId 
     * @param methodId 
     * @param methodArgs 
     */
    executeMethodObservable(m4objectId: string, nodeId: string, methodId: string, methodArgs: any[]): rxjs.Observable<M4Request>{
        const _executeMethodObservable = rxjs.from(this.executeMethodPromise(m4objectId, nodeId, methodId, methodArgs));
        return _executeMethodObservable;
    }

    createM4NodeObservable(m4Node : M4Node): rxjs.Observable<any> {
        const _localWindow = this.getWindow();
        const observable = new rxjs.Observable(subscriber => {
            function subscriberFunc(itemValue:any){
                subscriber.next(itemValue);
                subscriber.complete();
            }
            m4Node.register(_localWindow.meta4.M4EventTypes.getItemChanged(), subscriberFunc.bind(this), null);
          });
        return observable
    }
}