"use strict";

import { M4ApiNode }  from './m4apiNode';

async function _initialize(server: string, user:string, pass:string) {
    const _m4apiNode = new M4ApiNode(server,user,pass);
    await _m4apiNode.initializeAsync();
    return _m4apiNode;
}

export const M4ApiNodejs = _initialize;