import { M4Object } from "./M4Object";

export interface M4Request {
    getMethodId(): string;
    getNodeId(): string;
    getObjectId(): string;
    addReference(alias:string, object: M4Object): void
    getResult(): any
    getErrorException(): any
    getErrorCode(): number
    getErrorMessage(): string
    getObject(): M4Object
}