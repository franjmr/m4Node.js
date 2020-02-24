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

### Running from command line
Install using [npm](https://www.npmjs.com/)
```
npm install @automation/m4nodejs
```

### Usage in a node app
Create a file named `myfirstcode.ts`, this will contain:

```javascript
import { M4ApiNodejs } from "@automation/m4nodejs";
import { M4ApiNode } from "@automation/m4nodejs/dist/m4apiNode";;

async function executeLogon(){
    const m4ApiNode = await M4ApiNodejs('http://myserver.domain.com:9999','userHere','passHere');
    const m4LogonResult = await m4ApiNodejs.logon();
    console.log(m4LogonResult.getToken());
    await m4ApiNodejs.logout();
}

executeLogon();
```

### Usage in a Jasmine test
Create a file named `myfirstcode.spec.ts`, this will contain:

```javascript
import { M4ApiNodejs } from "@automation/m4nodejs";
import { M4ApiNode } from "@automation/m4nodejs/dist/m4apiNode";

describe("M4JSAPI - Logon suite", () => {
    let m4ApiNodejs: M4ApiNode ;
    
    beforeAll(async ()=>{
        const server = "http://arya.meta4.com:5020";
        const user = "ORLIEMOBILE";
        const pass = "RUN";
        m4ApiNodejs = await M4ApiNodejs(server,user,pass);
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

## Api Reference
- <b>createM4Object(m4objectId: string): Promise<M4Object>;</b> Load M4Object metadata and create object instance asynchronous
- <b>createM4Request(m4object: M4Object, nodeId: string, methodId: string, methodArgs: any[]): M4Request;</b> Create M4Request instance
- <b>createObservableByNodeCurrentChanged(m4Node: M4Node): rxjs.Observable<any>;</b> Register node current changed callback as RxJS Observable
- <b>createObservableByNodeItemChanged(m4Node: M4Node): rxjs.Observable<any>;</b> Register node item changed callback as RxJS Observable
- <b>createObservableByNodeRecordsChanged(m4Node: M4Node): rxjs.Observable<any>;</b> Register node records changed callback as RxJS Observable
- <b>executeM4ObjectMethod(m4object: M4Object, nodeId: string, methodId: string, methodArgs: any[]): Promise<M4Request>;</b> Execute method promise-based asynchronous
- <b>executeM4Request(m4Request: M4Request): Promise<M4Request>;</b> Execute MRequest instance
- <b>executeMethod(m4objectId: string, nodeId: string, methodId: string, methodArgs: any[]): Promise<M4Request>;</b> Execute method promise-based asynchronous
- <b>executeMethodExtend(m4objectId: string, nodeId: string, methodId: string, methodArgs: any[]): Promise<M4Request>;</b> Load M4Object Metadata and execute method promise-based asynchronous
- <b>executeMethodObservable(m4objectId: string, nodeId: string, methodId: string, methodArgs: any[]): rxjs.Observable<M4Request>;</b> Convert Execute Method Promise to Observable RxJS
- <b>loadMetadata(m4objects: string[]): Promise<M4Request>;</b> Load Metadata promise-based asynchronous
- <b>logon(): Promise<M4LogonResult>;</b> Logon User promise-based asynchronous
- <b>logout(): Promise<boolean>;</b> Logout User promise-based asynchronous


## Documentation
- [JSDom](https://github.com/jsdom/jsdom)
- [TypeScript](https://www.typescriptlang.org)
- [Rxjs](https://rxjs-dev.firebaseapp.com/)
- [Async/Await](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous)