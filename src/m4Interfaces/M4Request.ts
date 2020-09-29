import { M4Object } from "./M4Object";
import { M4LogMessage } from "./M4LogMessage";

export interface M4Request {
    new (m4object:M4Object, nodeId:string, methodId:string, methodArgs:any[]): M4Request;
    getMethodId(): string;
    getNodeId(): string;
    getObjectId(): string;
    addReference(alias:string, object: M4Object): void
    getResult(): any
    getErrorException(): any
    getErrorCode(): number
    getErrorMessage(): string
    getObject(): M4Object
    getLogSize(): number;
    getLogMessage(index: number): M4LogMessage;
}