import { M4ApiNode } from "./..//src/m4apiNode";

describe("Initialize M4Node.ts Suite", ()=>{
    test("Should create a M4ApiNode.ts instance", ()=> {
        const m4Node = new M4ApiNode("server","user","pass");
        expect(m4Node).toBeTruthy();
    });

    test("Should throw an error when initialize is not success", (done)=> {
        const m4Node = new M4ApiNode("server","user","pass");
        m4Node.initialize().catch((error: TypeError) => {
            expect(error.message).toContain("Invalid URL")
            done();
        });
    });
});