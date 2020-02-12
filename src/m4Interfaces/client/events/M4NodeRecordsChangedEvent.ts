import { M4Node } from "../../M4Node";

export interface M4NodeRecordsChangedEvent {
    getNode(): M4Node    
    getType(): number
    getContext(): any
    getOrigin(): object
    getId(): string		
}