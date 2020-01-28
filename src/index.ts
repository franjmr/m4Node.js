"use strict";

import { M4ApiNode }  from './m4apiNode';

async function _initialize(server: string, user:string, pass:string) {
    const _m4apiNode = new M4ApiNode(server,user,pass);
    const _initializedInstance = await _m4apiNode.initializeAsync();
    return _initializedInstance;
}

export const m4ApiNode = _initialize;