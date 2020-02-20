import { M4Node } from "./M4Node";

export interface M4Object {
    getId(): string;
    getNode(nodeId:string): M4Node;
}