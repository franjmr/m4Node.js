import { M4NodeJS } from "../m4nodejs";
import { M4Request } from "../m4Interfaces/M4Request";
import { M4Executor } from "../m4Interfaces/M4Executor";
import { DOMWindow } from "jsdom";
import { M4Object } from "../m4Interfaces/M4Object";
import { M4Node } from "../m4Interfaces/M4Node";
import { M4NodeJsFactory } from "..";

const server:string = "http://jonsnow:13020";
const user:string = "JCM_ESS";
const pass:string = "123";
const lang:string = "2";

const M4_OBJECT_ID:string = "PLCO_LOAD_ALL_PERSONAL_INFO";
const M4_NODE_ID:string = "PLCO_PERSONAL_EMPLOYEE_INFORMT";
const M4_METHOD_ID:string = "PLCO_LOAD_ALL_PERSONAL_INFO";

function _logout(m4Executor: M4Executor): void{
    m4Executor.logout(()=>{
        console.log("All done!");
    },()=>{
        console.log("All done!");
    })
}

/**
 * Use Window object to create M4JSAPI instances and execute M4JSAPI prototype
 */
async function exampleUseWindowObjectOnly():Promise<void> {
    const m4NodeJS: M4NodeJS = await M4NodeJsFactory.newInstance(server);
    
    const _window: DOMWindow = m4NodeJS.getWindow();

    _window.meta4.M4Executor.setServiceBaseUrl(server);
    const m4Executor: M4Executor = new _window.meta4.M4Executor();

    m4Executor.logon(user,pass,lang,()=>{
        m4Executor.loadMetadata([M4_OBJECT_ID],()=>{
            const t3js:M4Object = new _window.meta4.M4Object(M4_OBJECT_ID);
            const requestArgs:string[] = ["","",""];
            const m4Request = new _window.meta4.M4Request(t3js,M4_NODE_ID, M4_METHOD_ID, requestArgs);
            
            m4Executor.execute(m4Request,(m4RequestSuccess: M4Request)=> {
                const m4Object:M4Object = m4RequestSuccess.getObject();
                const m4Node:M4Node = m4Object.getNode("PSCO_EMPLOYEE_RECORD_HEADER");
                const employeName:string = m4Node.getValue("PSCO_EMPLOYEE_NAME");
                console.log("Hi "+employeName+ "!");
                _logout(m4Executor);
            },(m4RequestFailure: M4Request)=> {
                console.log("Error executing request! Detail: "+m4RequestFailure.getErrorMessage());
                _logout(m4Executor);
            });
            
        },()=>{
            console.log("Error loading metadata!");
            _logout(m4Executor);
        })
    },()=>{
        console.log("Error logon");
    });
}

exampleUseWindowObjectOnly();