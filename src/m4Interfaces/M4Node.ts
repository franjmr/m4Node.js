export interface M4Node {
  addRecord(): void;
  getId(): string;
  getNodeValues(): any[];
  count(): number;
  getCurrent(): number;
  getValue(itemId: string): any;
  getValues(itemIds: string[], recordIndex: number): any;
  isModified(): boolean;
  isNew(): boolean;
  isToDelete(): boolean;
  moveTo(index: number): any;
  moveToEOF(): any;
  setToDelete(): any;
  setValue(itemId: string, value: any): any;
  register(eventType: any, callback: any, context: any): boolean;
}
