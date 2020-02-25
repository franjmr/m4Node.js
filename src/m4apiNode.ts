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
    private showConsoleMsg: boolean;

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
      this.showConsoleMsg = false;
    }

    /**
     * Returns User property value setted in constructor.
     */
    getUser(): string {
        return this.user;
    }

    /**
     * Returns Server property value setted in constructor.
     */
    getServer(): string {
        return this.server;
    }

    /**
     * Returns Api URL. (M4JSAPI Node URL)
     */
    getApiUrl(): string {
        return this.apiUrl;
    }

    /**
     * Returns Cookie Storage. (https://www.npmjs.com/package/tough-cookie)
     */
    getCookieStore(): tough.MemoryCookieStore{
        return this.m4Store;
    }

    /**
     * Enable Console messages.
     */
    enableConsoleMessages():void {
        this.showConsoleMsg = true;
    }

    /**
     * Disable Console messages.
     */
    disableConsoleMessages():void{
        this.showConsoleMsg = false;
    }


    __getWindowObject__():any{
        return this.m4Window;
    }

    __importJsFileFromUrl__(url:string): Promise<boolean>{
        this.consoleMessage("Loading Javascript file from url: "+url);
        return new Promise((resolve) => { 
            http.get( url, (res) => {
                res.setEncoding('utf8');
                res.pipe(concat({ encoding: 'string' }, (remoteSrc:string) => {
                    const randomNameFile = Math.random().toString(36).substring(7);
                    vm.runInThisContext(remoteSrc, 'remote_modules/'+randomNameFile+".js");
                    resolve(true);
                }));
            });
        });
    }

    /**
     * Print menssage in the console.
     * @param {String} message 
     */
    private consoleMessage(message:string):void{
        if(this.showConsoleMsg){
            console.log("[M4Node.js] - "+message);
        }
    }

    /**
     * Get M4Executor.
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
     * Import M4JSAPI from apiUrl property.
     */
    private importM4Jsapi(): Promise<boolean>{
        this.consoleMessage("Loading M4JSAPI from url: "+this.apiUrl);
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
     * Set M4Executor.
     * @param {com.meta4.js.client.M4Executor} m4Executor
     */
    private setM4Executor(m4Executor: M4Executor){
        this.m4Executor = m4Executor;
    }

    /**
     * Resolves when M4JSAPI library is loaded.
     * @returns {Promise}
     */
    private isM4JsapiLoaded(): Promise<boolean> {
        return new Promise((resolve) => { 
            window.meta4OnLoad = function meta4OnLoad() {
                resolve(true);
            }
        });
    }

    /**
     * Return jsdom.DOMWindow from instance.
     */
    private getWindow() : jsdom.DOMWindow{
        return this.m4Window;
    }

    /**
     * Create M4Executor instance.
     */
    private createM4Executor(): void{
        const localWindow = this.getWindow();
        localWindow.meta4.M4Executor.setServiceBaseUrl(this.server);
        this.setM4Executor(new localWindow.meta4.M4Executor());
    }

    /**
     * Initialize M4jsapi instance as jsdom.DOMWindow.
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

        global.window = this.m4Window;
        global.document = this.m4Window.document;
        global.navigator = this.m4Window.navigator;
        global.DOMParser = this.m4Window.DOMParser;

        await this.importM4Jsapi();

        const bIsM4JsapiLoaded = await this.isM4JsapiLoaded();
        return bIsM4JsapiLoaded;
    }

    /**
     * Logon User promise-based asynchronous.
     */
    logon(): Promise<M4LogonResult>{
        const _m4Executor = this.getM4Executor();
        const _user = this.user;
        const _pass = this.pass;
        this.consoleMessage("User Logon '"+_user+"'");
        return new Promise((resolve, reject) => { 
            _m4Executor.logon(_user, _pass, "2", 
                (request: M4Request) => {
                    if (!request.getResult()) {
                        reject(request);
                    }else {
                        resolve(request.getResult());
                    }
                }, 
                (request: M4Request) => {
                    reject(request);
                }
            );
        });
    }

    /**
     * Logout User promise-based asynchronous.
     */
    logout(): Promise<M4Request>{
        const _m4Executor = this.getM4Executor();
        this.consoleMessage("User logout '"+this.user+"'");
        return new Promise((resolve) => { 
            _m4Executor.logout(
                (request) => {
                    resolve(request);
                }, 
                (request: M4Request) => {
                    resolve(request);
                }
            );
        });
    }

    /**
     * Load Metadata promise-based asynchronous.
     * @param {Array} m4ObjectIds M4Object Ids to load metadata.
     */
    loadMetadata(m4ObjectIds: string[]): Promise<M4Request> { 
        this.consoleMessage("Loading the metadata objects: "+m4ObjectIds.toString());
        const _m4Executor = this.getM4Executor();
        return new Promise((resolve,reject) => { 
            _m4Executor.loadMetadata(m4ObjectIds, 
                (request: M4Request) => {
                    resolve(request);
                }, 
                (request: M4Request) => {
                    reject(request);
                }
            );
        }) 
    };

    /**
     * Execute method promise-based asynchronous. [Implicitly load metadata]
     * @param {String} m4objectId M4Object ID
     * @param {String} nodeId Node ID
     * @param {String} methodId Method ID
     * @param {Array} methodArgs Method arguments
     */
    async executeMethod(m4objectId: string, nodeId: string, methodId: string, methodArgs: any[]): Promise<M4Request> { 
        this.consoleMessage("Execute method - Detail > M4O: '"+m4objectId+"' > Node: '"+nodeId+"' > Method: '"+methodId+"'");
        const m4object = await this.createM4Object(m4objectId);
        const executeMethod = await this.executeM4ObjectMethod(m4object,nodeId, methodId, methodArgs);
        return executeMethod;
    };

    /**
     * Execute method promise-based asynchronous.
     * @param {String} m4objectId M4Object ID
     * @param {String} nodeId Node ID
     * @param {String} methodId Method ID
     * @param {Array} methodArgs Method arguments
     */
    executeM4ObjectMethod(m4object: M4Object, nodeId: string, methodId: string, methodArgs: any[]): Promise<M4Request> { 
        const _m4Executor = this.getM4Executor();
        const _localWindow = this.getWindow();
        this.consoleMessage("Execute M4Object method - Detail > M4O: '"+m4object.getId()+"' > Node: '"+nodeId+"' > Method: '"+methodId+"'");
        return new Promise((resolve,reject) => { 
            const _request: M4Request = new _localWindow.meta4.M4Request(m4object, nodeId, methodId, methodArgs);
            _m4Executor.execute(_request,
                (request: M4Request) => {
                    resolve(request);
                }, 
                (request: M4Request) => {
                    reject(request);
                }
            );
        }) 
    };

    /**
     * Execute MRequest instance.
     * @param {M4Request} m4Request
     */
    executeM4Request(m4Request: M4Request): Promise<M4Request> { 
        const _m4Executor = this.getM4Executor();
        this.consoleMessage("Execute M4Request - Detail > M4O: '"+m4Request.getObjectId()+"' > Node: '"+m4Request.getNodeId()+"' > Method: '"+m4Request.getMethodId()+"'");
        return new Promise((resolve,reject) => { 
            _m4Executor.execute(m4Request,
                (request: M4Request) => {
                    resolve(request);
                }, 
                (request: M4Request) => {
                    reject(request);
                }
            );
        }) 
    };

    /**
     * Execute method promise-based asynchronous.
     * @param {M4Object} m4object M4Object instance
     * @param {String} nodeId Node ID
     * @param {String} methodId Method ID
     * @param {Array} methodArgs Method arguments
     */
    createM4Request(m4object: M4Object, nodeId: string, methodId: string, methodArgs: any[]): M4Request { 
        const _localWindow = this.getWindow();
        const _request: M4Request = new _localWindow.meta4.M4Request(m4object, nodeId, methodId, methodArgs);
        return _request
    };
    
    /**
     * Convert execute method Promise to Observable RxJS. [Implicitly load metadata]
     * @param {String} m4objectId M4Object ID
     * @param {String} nodeId Node ID
     * @param {String} methodId Method ID
     * @param {Array} methodArgs Method arguments
     */
    executeMethodObservable(m4objectId: string, nodeId: string, methodId: string, methodArgs: any[]): rxjs.Observable<M4Request>{
        const _executeMethodObservable = rxjs.from(this.executeMethod(m4objectId, nodeId, methodId, methodArgs));
        return _executeMethodObservable;
    }

    /**
     * Create object instance asynchronous. [Implicitly load metadata]
     * @param {String} m4objectId M4Object ID
     */
    async createM4Object(m4objectId: string): Promise<M4Object>{
        await this.loadMetadata([m4objectId]);
        const _localWindow = this.getWindow(); 
        return new _localWindow.meta4.M4Object(m4objectId);
    }

    /**
     * Register node item changed callback as RxJS Observable.
     * @param {M4Node} m4Node M4Node
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
     * Register node records changed callback as RxJS Observable.
     * @param {M4Node} m4Node M4Node
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
     * Register node current changed callback as RxJS Observable.
     * @param {M4Node} m4Node M4Node
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