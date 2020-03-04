# M4Node.js
M4Node.js abstracts the M4JSAPI library and provides a instances builder with an api of it per user session.

The prototype is implemented in typescript and offers the possibility of interacting with the M4JSAPI library with [promises](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous) (async / await) and [observables](https://rxjs-dev.firebaseapp.com/guide/observable) (Rxjs)

## Purpose:
- Create a user session per instance to work in different contexts with the M4JSAPI library.
- Provide an API that can be easily integrated with Node.js developments.
- Object Oriented Programming Features.
- Back-end Developer.
- TypeScript: Strict typing, Structural typing, Type annotations and Type inference.
- Observable Rxjs: Observer pattern (reactive programming) to write asynchronous code.
- Promises: To write asynchronous code a promise represents a value that may be available now, in the future, or never.
- Testing with Jasmine framework.

## Getting Started
- M4Node.js: provides an api to work, mock and debug the M4JSAPI
- M4Utils: provides tools to make test implementation easier

### Running from command line
Install using [npm](https://www.npmjs.com/)
```
npm install @automation/m4nodejs
```

### Usage M4Node.js in a node app
Create a file named `myfirstcode.ts`, this will contain:

```javascript
import { M4ApiNodejs } from "@automation/m4nodejs";
import { M4ApiNode } from "@automation/m4nodejs/dist/m4apiNode";;

async function executeLogon(){
    const m4ApiNode = await M4ApiNodejs('http://myserver.domain.com:9999','Pau','Phoenix');
    const m4LogonResult = await m4ApiNodejs.logon();
    console.log(m4LogonResult.getToken());
    await m4ApiNodejs.logout();
}

executeLogon();
```

### Usage M4Node.js in a Jasmine test
Create a file named `myfirstcode.spec.ts`, this will contain:

```javascript
import { M4ApiNodejs } from "@automation/m4nodejs";
import { M4ApiNode } from "@automation/m4nodejs/dist/m4apiNode";

describe("M4JSAPI - Logon suite", () => {
    let m4ApiNodejs: M4ApiNode ;
    
    beforeAll(async ()=>{
        m4ApiNodejs = await M4ApiNodejs('http://myserver.domain.com:9999','Marshall','Law');
    });

    afterAll(async() => {
        await m4ApiNodejs.logout();
    })

    it("should do logon", async () => {
        const token = await m4ApiNodejs.logon()
        expect(token).toBeTruthy();
    });
});
```

### Usage M4Node.js Mocking in a Jasmine test
- Set M4Object XML metadata in "./__mocks__/metadata/" project folder
- Create a file named `myfirstcode.mock.spec.ts`, this will contain:

```javascript
import {M4ApiNodejs} from "@automation/m4nodejs"
import { M4ApiNode } from "@automation/m4nodejs/dist/m4apiNode";
import * as fs from "fs";

describe("M4JSAPI - Mock suite", ()=>{
    
    let m4Nodejs : M4ApiNode;
    
    beforeAll(async()=>{
        m4Nodejs = await M4ApiNodejs("http://myserver.domain.com:9999", "Chuck_Norris", "Walker Texas Ranger");
        m4Nodejs.__mock__initialize__();
        m4Nodejs.__mock__setM4ObjectMetadata__("PLCO_LOAD_ALL_PERSONAL_INFO", fs.readFileSync("./__mocks__/metadata/PLCO_LOAD_ALL_PERSONAL_INFO.xml", 'utf8'))
    })

    it("should create M4JSAPI objects with mocked metadata",async()=>{
        const m4ObjLoadAllPersonInfoMock = await m4Nodejs.createM4Object("PLCO_LOAD_ALL_PERSONAL_INFO");
        const m4RequestLoadAllPersonalInfoMock = m4Nodejs.createM4Request(m4ObjLoadAllPersonInfoMock, "PLCO_PERSONAL_EMPLOYEE_INFORMT", "PLCO_LOAD_ALL_PERSONAL_INFO", ["","",""]);
        expect(m4ObjLoadAllPersonInfoMock).toBeTruthy();
        expect(m4RequestLoadAllPersonalInfoMock).toBeTruthy();
    });
});
```

### Usage M4TestUtils to extract Metadata content to a xml file
Create a file named `myfirstcode.create.xml.spec.ts`, this will contain:

```javascript
import { M4TestUtils } from "@automation/m4nodejs";

async function example(){
    const m4TestUtils = new M4TestUtils();
    await m4TestUtils.createXmlMetadataFile("http://myserver.domain.com:9999","Lee","Chaolan","M4OBJECT_ID","C:/Temp");
}

example();
```

## M4Node.js
### Api Reference to interact with M4JSAPI
- <b>createM4Object(m4objectId: string): Promise<M4Object>;</b> Create object instance asynchronous. [Implicitly load metadata]
- <b>createM4Request(m4object: M4Object, nodeId: string, methodId: string, methodArgs: any[]): M4Request;</b> Create M4Request instance
- <b>createObservableByNodeCurrentChanged(m4Node: M4Node): rxjs.Observable<any>;</b> Register node current changed callback as RxJS Observable
- <b>createObservableByNodeItemChanged(m4Node: M4Node): rxjs.Observable<any>;</b> Register node item changed callback as RxJS Observable
- <b>createObservableByNodeRecordsChanged(m4Node: M4Node): rxjs.Observable<any>;</b> Register node records changed callback as RxJS Observable
- <b>executeM4ObjectMethod(m4object: M4Object, nodeId: string, methodId: string, methodArgs: any[]): Promise<M4Request>;</b> Execute method promise-based asynchronous
- <b>executeM4Request(m4Request: M4Request): Promise<M4Request>;</b> Execute MRequest instance
- <b>executeMethod(m4objectId: string, nodeId: string, methodId: string, methodArgs: any[]): Promise<M4Request>;</b> Execute method promise-based asynchronous. [Implicitly load metadata]
- <b>executeMethodObservable(m4objectId: string, nodeId: string, methodId: string, methodArgs: any[]): rxjs.Observable<M4Request>;</b> Convert execute method Promise to Observable RxJS. [Implicitly load metadata]
- <b>loadMetadata(m4objects: string[]): Promise<M4Request>;</b> Load Metadata promise-based asynchronous
- <b>logon(): Promise<M4LogonResult>;</b> Logon User promise-based asynchronous
- <b>logout(): Promise<M4Request>;</b> Logout User promise-based asynchronous

### Api Reference to mocking M4JSAPI
- <b>__mock__initialize__(): void;</b> Initialize M4JSAPI Mock (Override M4Executor.LoadMetadata: Load XML Metadata from mock)
- <b>__mock__reset__(): void;</b>  Reset Mock (Clear M4Object XML Metadata mocked)
- <b>__mock__finalize__(): void;</b> Finalize M4JSAPI Mock (Restores original M4Executor.LoadMetadata)
- <b>__mock__setM4ObjectMetadata__(m4objectId: string, m4ObjectMetadata: string): void;</b> Set M4Object Metadata Content to mocking M4Executor.LoadMetadata
- <b>__getWindowObject__(): Window;</b> Get Window Object from this instance

### Api Reference to Debugging
- <b>enableConsoleMessages(): void;</b> Enable Console messages
- <b>disableConsoleMessages(): void;</b> Disable Console messages
- <b>getApiUrl(): string;</b> Returns Api URL (M4JSAPI Node URL)
- <b>getCookieStore(): tough.MemoryCookieStore;</b> Returns Cookie Storage (https://www.npmjs.com/package/tough-cookie)
- <b>getUser(): string;</b> Returns User property value setted in constructor
- <b>getServer(): string;</b> Returns Server property value setted in constructor

## M4TestUtils
### Api Reference
- <b>createXmlMetadataFile(server: string, user: string, pass :string, m4objectId: string, filepath: string): void;</b> Create xml file with the M4Object metadata definition

## Documentation
- [JSDom](https://github.com/jsdom/jsdom)
- [TypeScript](https://www.typescriptlang.org)
- [Rxjs](https://rxjs-dev.firebaseapp.com/)
- [Async/Await](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous)
- [Jasmine](https://jasmine.github.io/)