import { M4NodeJS } from "../dist/m4nodejs";

describe("M4ApiNode constructor Suite", ()=>{

    beforeAll(()=>{
        jest.setTimeout(60000);
    })
    
    test("should load M4JSAPI when use constructor without arguments", ()=> {
        const server = "http://jonsnow:13020";
        const m4Node = new M4NodeJS(server);
        expect(m4Node).toBeTruthy();
    });

    test("should load M4JSAPI when use constructor with arguments", (done)=> {
        const server = "http://jonsnow:13020";
        const user = "JCM_ESS";
        const pass = "123";
        const m4Node = new M4NodeJS(server,user,pass);
        expect(m4Node).toBeTruthy();
    });
});