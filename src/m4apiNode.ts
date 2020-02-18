import jsdom = require("jsdom");
import rxjs = require('rxjs');
import { M4Executor } from './m4Interfaces/M4Executor';
import { M4Request } from './m4Interfaces/M4Request';
import tough = require('tough-cookie');
import http = require('http');
import vm  = require('vm');
import concat = require('concat-stream');
import { M4Node } from "./m4Interfaces/M4Node";
import { M4Object } from "./m4Interfaces/M4Object";
import { M4NodeCurrentChangedEvent } from "./m4Interfaces/client/events/M4NodeCurrentChangedEvent";
import { M4NodeRecordsChangedEvent } from "./m4Interfaces/client/events/M4NodeRecordsChangedEvent";
import { M4ItemChangedEvent } from "./m4Interfaces/client/events/M4ItemChangedEvent";
import { M4LogonResult } from "./m4Interfaces/M4LogonResult";

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

    private server: string;
    private user: string;
    private pass: string;
    private apiUrl: string;
    private m4Executor: M4Executor;
    private m4Window : any;
    private m4Store: tough.MemoryCookieStore;
    private m4CookieStore: tough.CookieJar;

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

    getUser(): string {
        return this.user;
    }

    getServer(): string {
        return this.server;
    }

    getApiUrl(): string {
        return this.apiUrl;
    }

    getCookieStore(): tough.MemoryCookieStore{
        return this.m4Store;
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
    private importM4Jsapi(): Promise<boolean>{
        console.log("Loading M4JSAPI from url: "+this.apiUrl);
        const apiUrl = this.apiUrl;
        return new Promise((resolve) => { 
            http.get( apiUrl, (res) => {
                res.setEncoding('utf8');
                res.pipe(concat({ encoding: 'string' }, (remoteSrc:string) => {
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

    /**
     * Return jsdom.DOMWindow from instance
     */
    private getWindow() : jsdom.DOMWindow{
        return this.m4Window;
    }

    /**
     * Create M4Executor instance
     */
    private createM4Executor(): void{
        const localWindow = this.getWindow();
        localWindow.meta4.M4Executor.setServiceBaseUrl(this.server);
        this.setM4Executor(new localWindow.meta4.M4Executor());
    }

    /**
     * Initialize M4jsapi instance as jsdom.DOMWindow
     */
    async initializeAsync(): Promise<boolean>{
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
     * Load M4Object Metadata and execute M4Request asynchronous
     * @param m4objectId 
     * @param nodeId 
     * @param methodId 
     * @param methodArgs 
     */
    async executeMethodExtendAsync(m4objectId: string, nodeId: string, methodId: string, methodArgs: any[]): Promise<M4Request>{
        await this.loadMetadataPromise([m4objectId]);
        const executeMethodPromise = await this.executeMethodPromise(m4objectId,nodeId,methodId, methodArgs);
        return executeMethodPromise;
    }

    /**
     * Logon User promise-based asynchronous
     */
    logonPromise(): Promise<M4LogonResult>{
        const _m4Executor = this.getM4Executor();
        const _user = this.user;
        const _pass = this.pass;
        return new Promise((resolve, reject) => { 
            console.log("Doing logon with user: "+_user+"...");
            _m4Executor.logon(_user, _pass, "2", 
                (request: M4Request) => {
                    if (!request.getResult()) {
                        console.log("Logon error!");
                        reject();
                    }else {
                        console.log("Logon Success!");
                        const loginResult = request.getResult();
                        resolve(loginResult);
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
     * Logout User promise-based asynchronous
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
     * Load Metadata promise-based asynchronous
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
     * Execute method promise-based asynchronous
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
            const _request = new _localWindow.meta4.M4Request(_obj, _node.getId(), methodId, methodArgs);
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
     * Execute method promise-based asynchronous
     * @param {M4Object} m4objectId 
     * @param {String} nodeId 
     * @param {String} methodId 
     * @param {Array} methodArgs
     */
    executeM4ObjectMethodPromise(m4object: M4Object, nodeId: string, methodId: string, methodArgs: any[]): Promise<M4Request> { 
        const _m4Executor = this.getM4Executor();
        const _localWindow = this.getWindow();
        return new Promise((resolve) => { 
            const _request = new _localWindow.meta4.M4Request(m4object, nodeId, methodId, methodArgs);
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
     * Execute MRequest instance
     * @param {M4Request} m4Request
     */
    executeM4RequestPromise(m4Request: M4Request): Promise<M4Request> { 
        const _m4Executor = this.getM4Executor();
        return new Promise((resolve) => { 
            _m4Executor.execute(m4Request,
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
     * Create M4Request instance
     * @param {M4Object} m4objectId 
     * @param {String} nodeId 
     * @param {String} methodId 
     * @param {Array} methodArgs
     */
    createM4Request(m4object: M4Object, nodeId: string, methodId: string, methodArgs: any[]): M4Request { 
        const _localWindow = this.getWindow();
        const _request: M4Request = new _localWindow.meta4.M4Request(m4object, nodeId, methodId, methodArgs);
        return _request
    };
    
    /**
     * Convert Execute Method Promise to Observable RxJS
     * @param {String} m4objectId 
     * @param {String} nodeId 
     * @param {String} methodId 
     * @param {Array} methodArgs
     */
    executeMethodObservable(m4objectId: string, nodeId: string, methodId: string, methodArgs: any[]): rxjs.Observable<M4Request>{
        const _executeMethodObservable = rxjs.from(this.executeMethodPromise(m4objectId, nodeId, methodId, methodArgs));
        return _executeMethodObservable;
    }

    /**
     * Load M4Object metadata and create object instance asynchronous
     * @param {String} m4objectId 
     */
    async createM4ObjectAsync(m4objectId: string): Promise<M4Object>{
        await this.loadMetadataPromise([m4objectId]);
        const _localWindow = this.getWindow(); 
        return new _localWindow.meta4.M4Object(m4objectId);
    }

    /**
     * Register node item changed callback as RxJS Observable
     * @param {M4Node} m4Node 
     */
    createObservableByNodeItemChanged(m4Node : M4Node): rxjs.Observable<any> {
        const _localWindow = this.getWindow();
        const observable = new rxjs.Observable(subscriber => {
            function subscriberFunction(eventValue:M4ItemChangedEvent){
                subscriber.next(eventValue);
                subscriber.complete();
            }
            m4Node.register(_localWindow.meta4.M4EventTypes.getItemChanged(), subscriberFunction.bind(this), null);
          });
        return observable;
    }

    /**
     * Register node records changed callback as RxJS Observable
     * @param {M4Node} m4Node 
     */
    createObservableByNodeRecordsChanged(m4Node : M4Node): rxjs.Observable<any> {
        const _localWindow = this.getWindow();
        const observable = new rxjs.Observable(subscriber => {
            function subscriberFunction(eventValue:M4NodeRecordsChangedEvent){
                subscriber.next(eventValue);
                subscriber.complete();
            }
            m4Node.register(_localWindow.meta4.M4EventTypes.getNodeRecordsChanged(), subscriberFunction.bind(this), null);
          });
        return observable;
    }

    /**
     * Register node current changed callback as RxJS Observable
     * @param {M4Node} m4Node 
     */
    createObservableByNodeCurrentChanged(m4Node : M4Node): rxjs.Observable<any> {
        const _localWindow = this.getWindow();
        const observable = new rxjs.Observable(subscriber => {
            function subscriberFunction(eventValue:M4NodeCurrentChangedEvent){
                subscriber.next(eventValue);
                subscriber.complete();
            }
            m4Node.register(_localWindow.meta4.M4EventTypes.getNodeCurrentChanged(), subscriberFunction.bind(this), null);
          });
        return observable;
    }
}