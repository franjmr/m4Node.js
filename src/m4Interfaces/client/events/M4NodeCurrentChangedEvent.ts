import { M4Node } from "../../M4Node";

export interface M4NodeCurrentChangedEvent {
    getNode(): M4Node    
    getType(): number
    getContext(): any
    getOrigin(): object
    getId(): string					
}