import { M4Object } from "./M4Object";

export interface M4Event {
    getContext(): any
    getId(): string
    getOrigin(): M4Object
    setContext(context:any): void
    setId(id:string):void
    setOrigin(origin:any):void
}