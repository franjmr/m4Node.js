import { M4NodeJS } from "../dist/m4nodejs";

describe("M4Nodejs constructor Suite", ()=>{
    it("should create an instance when use the M4Nodejs constructor with the server url", ()=> {
        const server:string = "http://server.meta4.com";
        const m4Node:M4NodeJS = new M4NodeJS(server);
        expect(m4Node).toBeTruthy();
    });

    it("should create an instance when use the M4Nodejs constructor with the server url, user and pass", ()=> {
        const server:string = "http://server.meta4.com";
        const user:string = "User";
        const pass:string = "Pass";
        const m4Node:M4NodeJS = new M4NodeJS(server,user,pass);
        expect(m4Node).toBeTruthy();
    });
});