import { M4ApiNode } from "../src/m4apiNode";

jest.mock('require-from-url/sync', () => {
    return jest.fn().mockImplementation(() => {
        setTimeout( () => window.meta4OnLoad() , 300);
    });
});

describe("Initialize Async M4Node.ts Suite", ()=>{

    test("Should create a M4ApiNode.ts instance", ()=> {
        const m4Node = new M4ApiNode("server","user","pass");
        expect(m4Node).toBeTruthy();
    });

    test("Should throw an error with an invalid url", (done)=> {
        const m4Node = new M4ApiNode("server","user","pass");
        m4Node.initializeAsync().catch((error: TypeError) => {
            expect(error.message).toContain("Invalid URL")
            done();
        });
    });

    test("Should initialize success", (done)=> {
        const m4Node = new M4ApiNode("http://mock.url.com","user","pass");
        m4Node.initializeAsync().then( () => {
            expect(true).toBeTruthy();
            done();
        });
    });
});