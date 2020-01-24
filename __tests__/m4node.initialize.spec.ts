import { M4ApiNode } from "./..//src/m4apiNode";

jest.mock('require-from-url/sync', jest.fn())

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

    test("Should initialize success", (done)=> {
        const m4Node = new M4ApiNode("http://franciscocaw10.meta4.com:5020/pene.js","user","pass");
        m4Node.initialize().catch((error: TypeError) => {
            expect(error.message).toContain("Invalid URL")
            done();
        });
    });
});