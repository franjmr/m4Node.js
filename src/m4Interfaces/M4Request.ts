import { M4Object } from "./M4Object";

export interface M4Request {
    getResult(): any
    getErrorException(): any
    getObject(): M4Object
}