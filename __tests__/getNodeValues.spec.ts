import { M4NodeJS } from "../dist/m4nodejs";
import { M4NodeJsFactory } from "../dist/index"
import { M4LogonResult } from "../dist/m4Interfaces/M4LogonResult";
import { M4Object } from "../dist/m4Interfaces/M4Object";
import { M4Request } from "../dist/m4Interfaces/M4Request";
import { M4Node } from "../dist/m4Interfaces/M4Node";

const SERVER:string = "http://jonsnow:13020";
const M4_OBJECT_ID:string = "PLCO_LOAD_ALL_PERSONAL_INFO";
const M4_NODE_ID:string = "PLCO_PERSONAL_EMPLOYEE_INFORMT";
const M4_METHOD_ID:string = "PLCO_LOAD_ALL_PERSONAL_INFO";
const args:string[] = ["","",""];

describe("Get Node value Suite", ()=>{
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

    let m4Object: M4Object;
    let m4NodeJS: M4NodeJS;

    beforeAll(async (done)=>{
        try{
            m4NodeJS = await M4NodeJsFactory.newInstance(SERVER);
            await m4NodeJS.logon("JCM_ESS","123");
            const m4Request: M4Request = await m4NodeJS.executeMethod(M4_OBJECT_ID, M4_NODE_ID, M4_METHOD_ID, args);
            m4Object = m4Request.getObject();
            done();
        }catch(error){
            done.fail("BeforeAll error: "+error);
        }
    });

    afterAll(async()=>{
        if(m4NodeJS){
            await m4NodeJS.logout();
        }
    })

    it("should create an instance when use the M4Nodejs constructor with the server url", async ()=> {
        const m4Node:M4Node = m4Object.getNode("PSCO_EMPLOYEE_RECORD_HEADER");
        const employeName:string = m4Node.getValue("PSCO_EMPLOYEE_NAME");
        expect(employeName).toBeTruthy();
    });
});