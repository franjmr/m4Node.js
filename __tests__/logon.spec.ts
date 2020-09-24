import { M4NodeJS } from "../dist/m4nodejs";
import { M4NodeJsFactory } from "../dist/index"
import { M4LogonResult } from "../dist/m4Interfaces/M4LogonResult";

describe("M4Nodejs logon Suite", ()=>{
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

    let m4NodeJS: M4NodeJS;

    beforeAll(async (done)=>{
        const server:string = "http://jonsnow:13020";
        await M4NodeJsFactory.newInstance(server).then((api)=>{
            m4NodeJS = api;
            done();
        }).catch((error)=>{
            done.fail("Error loading m4jsapi from url: ".concat(server).concat("- Error: ").concat(error));
        });
    });

    afterAll(async()=>{
        if(m4NodeJS){
            await m4NodeJS.logout();
        }
    })

    it("should create an instance when use the M4Nodejs constructor with the server url", async ()=> {
        const m4LognResult: M4LogonResult = await m4NodeJS.logon("JCM_ESS","123");
        expect(m4LognResult.getToken()).toBeTruthy();
    });
});