"use strict";

import { M4ApiNode }  from './m4apiNode';

async function _initialize(server: string, user:string, pass:string) {
    const m4apiNode = new M4ApiNode(server,user,pass);
    m4apiNode.initialize().then(()=>{
        return m4apiNode;
    })
}

export const initialize = _initialize;