import { M4NodeJS } from "../m4nodejs";
import { M4NodeJsFactory } from "..";
import { M4Object } from "../m4Interfaces/M4Object";
import { M4Node } from "../m4Interfaces/M4Node";
import { DOMWindow } from "jsdom";

const server:string = "http://jonsnow:13020";
const user:string = "JCM_ESS";
const pass:string = "123";

const M4_OBJECT_ID:string = "PLCO_LOAD_ALL_PERSONAL_INFO";
const M4_NODE_ID:string = "PLCO_PERSONAL_EMPLOYEE_INFORMT";
const M4_METHOD_ID:string = "PLCO_LOAD_ALL_PERSONAL_INFO";

/**
 * Use Window object to create M4JSAPI instances and use this into M4Nodejs API.
 */
async function exampleUseWindowObject():Promise<void> {
    const m4NodeJS: M4NodeJS = await M4NodeJsFactory.newInstance(server);
    
    await m4NodeJS.logon(user,pass);
    await m4NodeJS.loadMetadata([M4_OBJECT_ID]);

    const _window: DOMWindow = m4NodeJS.getWindow();
    const m4Object: M4Object = new _window.meta4.M4Object(M4_OBJECT_ID);
    const args:string[] = ["","",""];
    await m4NodeJS.executeM4ObjectMethod(m4Object, M4_NODE_ID, M4_METHOD_ID, args);
    
    const m4Node:M4Node = m4Object.getNode("PSCO_EMPLOYEE_RECORD_HEADER");
    const employeeName:string = m4Node.getValue("PSCO_EMPLOYEE_NAME");
    
    console.log("Hi "+employeeName+ "!");
    
    await m4NodeJS.logout();

    console.log("All done!");
}

exampleUseWindowObject();