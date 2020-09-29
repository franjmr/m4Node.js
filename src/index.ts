"use strict";
import { M4NodeJS } from "./m4nodejs";
import { TestUtils } from "./testUtils";

/**
 * Create and load M4JSAPI Node
 * @param server 
 * @param user 
 * @param pass 
 */
async function _newInstance(server: string, user?:string, pass?:string) {
    const m4nodejs = new M4NodeJS(server,user,pass);
    await m4nodejs.load();
    return m4nodejs;
}

export const M4NodeJsFactory = {
    newInstance: _newInstance
};

export {
    M4NodeJS,
    TestUtils
};