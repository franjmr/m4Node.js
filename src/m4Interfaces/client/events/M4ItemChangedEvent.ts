import { M4Node } from "../../M4Node";

export interface M4ItemChangedEvent {
    getItemId():string				
    getNode():M4Node				
    getRecordIndex():number					
    getValue():any	
    getRecordId():number					
    getType():number					
    getContext():any	
    getOrigin():object				
    getId():string				
}