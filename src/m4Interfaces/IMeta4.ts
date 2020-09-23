import { M4Executor } from "./M4Executor";
import { M4LogMessage } from "./M4LogMessage";
import { M4LogonParams } from "./M4LogonParams";
import { M4LogonResult } from "./M4LogonResult";
import { M4Node } from "./M4Node";
import { M4Object } from "./M4Object";
import { M4Request } from "./M4Request";
import { com_meta4_js_shared_M4DataProperties } from "../m4Classes/M4DataProperties";
import { com_meta4_js_client_M4ItemMetadata } from "../m4Classes/M4ItemMetadata";
import { com_meta4_js_shared_M4LoadStatus } from "../m4Classes/M4LoadStatus";
import { com_meta4_js_client_M4NodeMetadata } from "../m4Classes/M4NodeMetadata";
import { com_meta4_js_client_M4ObjectMetadata } from "../m4Classes/M4ObjectMetadata";
import { com_meta4_js_shared_M4SecurityStatus } from "../m4Classes/M4SecurityStatus";

// tslint:disable-next-line: class-name
export interface meta4 {
    M4Executor: M4Executor;
    M4LogMessage: M4LogMessage;
    M4LogonParams:M4LogonParams;
    M4LogonResult: M4LogonResult;
    M4Node: M4Node;
    M4Object: M4Object;
    M4Request: M4Request;
    M4BlobFile: any;
    M4BlobRequestConfig: any;
    M4DataProperties: com_meta4_js_shared_M4DataProperties;
    M4ItemMetadata: com_meta4_js_client_M4ItemMetadata;
    M4LoadStatus: com_meta4_js_shared_M4LoadStatus;
    M4NodeMetadata: com_meta4_js_client_M4NodeMetadata;
    M4ObjectMetadata: com_meta4_js_client_M4ObjectMetadata;
    M4SecurityStatus: com_meta4_js_shared_M4SecurityStatus;
    M4EventTypes: any
}