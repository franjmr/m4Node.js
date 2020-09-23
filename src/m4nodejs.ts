import jsdom = require("jsdom");
import rxjs = require('rxjs');
import tough = require('tough-cookie');
import http = require('http');
import vm  = require('vm');
import concat = require('concat-stream');
import { M4Executor } from './m4Interfaces/M4Executor';
import { M4NodeCurrentChangedEvent } from "./m4Interfaces/client/events/M4NodeCurrentChangedEvent";
import { M4NodeRecordsChangedEvent } from "./m4Interfaces/client/events/M4NodeRecordsChangedEvent";
import { M4ItemChangedEvent } from "./m4Interfaces/client/events/M4ItemChangedEvent";
import { M4LogonResult } from "./m4Interfaces/M4LogonResult";
import * as MockXMLHttpRequest from "mock-xmlhttprequest";
import { M4Node } from "./m4Interfaces/M4Node";
import { M4Object } from "./m4Interfaces/M4Object"
import { M4Request } from './m4Interfaces/M4Request';
import { meta4 } from "./m4Interfaces/IMeta4";

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
        meta4: meta4;
        meta4OnLoad: any
    } 
}

interface Base {
    getApiUrl(): string;
    getServer(): string;
    getUser(): string;
}

interface Debug {
    enableConsoleMessages(): void;
    disableConsoleMessages(): void;
    getCookieStore(): tough.MemoryCookieStore;
    importJavaScriptFileFromUrl(url:string): void;
}

interface RxJS {
    createObservableByNodeItemChanged(m4Node : M4Node): rxjs.Observable<any>
    createObservableByNodeRecordsChanged(m4Node : M4Node): rxjs.Observable<any>
    createObservableByNodeCurrentChanged(m4Node : M4Node): rxjs.Observable<any>
    executeMethodObservable(m4objectId: string, nodeId: string, methodId: string, methodArgs: any[]): rxjs.Observable<M4Request>
}

interface Mock {
    initialize(): () => void;
    setM4ObjectMetadata(m4objectId: string, m4ObjectMetadata: string): () => void;
    finalize(): () => void;
}

export class M4NodeJS {
    private server: string;
    private user: string;
    private pass: string;
    private apiUrl: string;
    private m4Executor: M4Executor;
    private m4Window : any;
    private m4Store: tough.MemoryCookieStore;
    private m4CookieStore: tough.CookieJar;
    private showConsoleMsg: boolean;
    private isMocking: boolean;
    private mapMockM4ObjectMetadata: Map<string,string>;
    private m4WindowXHR: XMLHttpRequest;

    /**
     * Constructor
     * @param {string} server
     * @param {string} user
     * @param {string} pass
     */
    constructor(server: string, user?:string, pass?:string) {
      this.server = server;
      this.user = user;
      this.pass = pass;
      this.apiUrl = server + baseFile;
      this.m4Store = new tough.MemoryCookieStore();
      this.m4CookieStore = new tough.CookieJar(this.m4Store);
      this.showConsoleMsg = false;
      this.isMocking = false;
      this.mapMockM4ObjectMetadata = new Map();
    }

    /**
     * Returns User property value setted in constructor.
     */
    private __base__getUser(): string {
        return this.user;
    }

    /**
     * Returns Server property value setted in constructor.
     */
    private __base__getServer(): string {
        return this.server;
    }

    /**
     * Returns Api URL. (M4JSAPI Node URL)
     */
    private __base__getApiUrl(): string {
        return this.apiUrl;
    }

    /**
     * Returns Cookie Storage. (https://www.npmjs.com/package/tough-cookie)
     */
    private __debug__getCookieStore(): tough.MemoryCookieStore{
        return this.m4Store;
    }

    /**
     * Enable Console messages.
     */
    private __debug__enableConsoleMessages():void {
        this.showConsoleMsg = true;
    }

    /**
     * Disable Console messages.
     */
    private __debug__disableConsoleMessages():void{
        this.showConsoleMsg = false;
    }

    /**
     * Print M4Request log messages by console
     * @param m4Request 
     */
    private printM4RequestLogMessages(m4Request: M4Request, isError?:boolean): void{
        for(let logIndex = 0; logIndex < m4Request.getLogSize(); logIndex++ ){
            const logMsg = m4Request.getLogMessage(logIndex)
            this.consoleMessage("M4Request Log Message (Index "+logIndex+"): '"+logMsg.getMessage()+"'", isError);
        }
    }

    /**
     * Import JavaScript file: compile and run code 
     * @param {string} url 
     */
    private __importJavaScriptFileFromUrl__(url:string): Promise<boolean>{
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
     * Initialize M4JSAPI Mock
     * - Override M4Executor.LoadMetadata: Load XML Metadata from mock
     */
    private __mock__initialize__(): void {
        if(this.isMocking){
            return;
        }

        const _metadataValues = this.mapMockM4ObjectMetadata;
        const _mockXhr = MockXMLHttpRequest.newMockXhr();
    
        _mockXhr.onSend = (xhr : any) => {
            let _responseStatus = 0;
            let _responseHeaders = null
            let _responseData = null;

            try{
                const _urlLoadMetadata = this.server + "/servlet/M4JSServices/metadata/";

                if(!xhr.url || typeof xhr.url !== 'string'){
                    throw new Error("[M4Node.js] - Invalid URL in reponse");
                } 
                
                if(!xhr.url.startsWith(_urlLoadMetadata)){
                    throw new Error("[M4Node.js] - Mock not supported yet! Mock me: "+xhr.url);
                }
                
                const _xhrUrl :string = xhr.url;
                const _urlLoadMetadataV =  "v/";
                const _urlLoadMetadataMd =  "md/";

                if(_xhrUrl.includes(_urlLoadMetadataV)){
                    _responseStatus = 200;
                    _responseHeaders = { 'Content-Type': 'text/plain' };
                    _responseData = "";
                }else if(_xhrUrl.includes(_urlLoadMetadataMd)){
                    const idM4Object = _xhrUrl.substring((_xhrUrl.lastIndexOf(_urlLoadMetadataMd)+3),_xhrUrl.length);
                    const idM4ObjectTrim = idM4Object.replace("/","");

                    if(_metadataValues.has(idM4ObjectTrim) === false){
                        throw new Error("[M4Node.js] - M4Object '"+idM4ObjectTrim+"' metadata mock must be setted");
                    }
                    
                    _responseStatus = 200;
                    _responseHeaders = { 'Content-Type': 'text/xml' }
                    _responseData = _metadataValues.get(idM4ObjectTrim);

                }else{
                    throw new Error("[M4Node.js] - Mock not supported yet! Mock me: "+xhr.url);
                }
    
            }catch(error){
                console.error((error as Error).message);
                _responseStatus = 404;
                _responseHeaders = { 'Content-Type': 'text/plain' };
                _responseData = (error as Error).message;
            }

            xhr.respond(_responseStatus, _responseHeaders, _responseData);
        };
    
        this.m4WindowXHR = this.m4Window.XMLHttpRequest;
        this.m4Window.XMLHttpRequest = _mockXhr;
        this.isMocking = true;
    }

    /**
     * Reset Mock
     * - Clear M4Object XML Metadata mocked
     */
    private __mock__reset__(): void{
        this.mapMockM4ObjectMetadata.clear();
    }

    /**
     * Finalize M4JSAPI Mock
     * - Restores M4Executor.LoadMetadata
     */
    private __mock__finalize__(): void{
        if(!this.isMocking){
            return;
        }
        this.m4Window.XMLHttpRequest = this.m4WindowXHR;
        this.isMocking = false;
    }

    /**
     * Set M4Object Metadata Content to mocking M4Executor.LoadMetadata
     * @param {string} m4objectId 
     * @param {string} m4ObjectMetadata 
     */
    private __mock__setM4ObjectMetadata__(m4objectId: string, m4ObjectMetadata: string):void{
        this.mapMockM4ObjectMetadata.set(m4objectId, m4ObjectMetadata);
    }

    /**
     * Print menssage in the console.
     * @param {String} message
     * @param {boolean} isError 
     */
    private consoleMessage(message:string, isError?:boolean):void{
        if(this.showConsoleMsg){
            const consoleMsg = "[M4Node.js] - ".concat(message);
            isError? console.error(consoleMsg):console.log(consoleMsg);
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
    getWindow() : jsdom.DOMWindow{
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
     * Load M4jsapi instance as jsdom.DOMWindow.
     */
    async load(): Promise<boolean>{
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
    logon(user?: string, pass?: string): Promise<M4LogonResult>{
        const _m4Executor = this.getM4Executor();
        const _user = user? user: this.user;
        const _pass = pass? pass: this.pass;
        if(!_user || !_pass){
            throw new Error('Logon parameters are not valid!');
        }
        this.consoleMessage("User Logon '"+_user+"'");
        return new Promise((resolve, reject) => { 
            _m4Executor.logon(_user, _pass, "2", 
                (request: M4Request) => {
                    if (!request.getResult()) {
                        this.printM4RequestLogMessages(request,true);
                        reject(request);
                    }else {
                        resolve(request.getResult());
                    }
                }, 
                (request: M4Request) => {
                    this.printM4RequestLogMessages(request,true);
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
        this.consoleMessage("User logout!");
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
                    this.printM4RequestLogMessages(request,true);
                    reject(request);
                }
            );
        }) 
    }

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
    }

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
                (request: M4Request | any) => {
                    this.printM4RequestLogMessages(request,true);
                    reject(request);
                }
            );
        }) 
    }

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
                    this.printM4RequestLogMessages(request,true);
                    reject(request);
                }
            );
        }) 
    }

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
     * Convert execute method Promise to Observable RxJS. [Implicitly load metadata]
     * @param {String} m4objectId M4Object ID
     * @param {String} nodeId Node ID
     * @param {String} methodId Method ID
     * @param {Array} methodArgs Method arguments
     */
    private __rxjs__executeMethodObservable(m4objectId: string, nodeId: string, methodId: string, methodArgs: any[]): rxjs.Observable<M4Request>{
        const _executeMethodObservable = rxjs.from(this.executeMethod(m4objectId, nodeId, methodId, methodArgs));
        return _executeMethodObservable;
    }

    /**
     * Register node item changed callback as RxJS Observable.
     * @param {M4Node} m4Node M4Node
     */
    private __rxjs__createObservableByNodeItemChanged(m4Node : M4Node): rxjs.Observable<any> {
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
    private __rxjs__createObservableByNodeRecordsChanged(m4Node : M4Node): rxjs.Observable<any> {
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
    private __rxjs__createObservableByNodeCurrentChanged(m4Node : M4Node): rxjs.Observable<any> {
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

    // API
    base: Base = {
        getApiUrl: this.__base__getApiUrl.bind(this),
        getServer: this.__base__getServer.bind(this),
        getUser: this.__base__getUser.bind(this)
    }

    debug: Debug = {
        enableConsoleMessages: this.__debug__enableConsoleMessages.bind(this),
        disableConsoleMessages: this.__debug__disableConsoleMessages.bind(this),
        getCookieStore: this.__debug__getCookieStore.bind(this),
        importJavaScriptFileFromUrl: this.__importJavaScriptFileFromUrl__.bind(this)
    }

    rxjs: RxJS = {
        createObservableByNodeItemChanged: this.__rxjs__createObservableByNodeItemChanged.bind(this),
        createObservableByNodeRecordsChanged: this.__rxjs__createObservableByNodeRecordsChanged.bind(this),
        createObservableByNodeCurrentChanged: this.__rxjs__createObservableByNodeCurrentChanged.bind(this),
        executeMethodObservable: this.__rxjs__executeMethodObservable.bind(this)
    }

    mock: Mock = {
        initialize: this.__mock__initialize__.bind(this),
        setM4ObjectMetadata: this.__mock__setM4ObjectMetadata__.bind(this),
        finalize: this.__mock__finalize__.bind(this)
    }

}