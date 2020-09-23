import { com_meta4_js_client_M4Object } from "./M4Object";
import { com_meta4_js_client_M4ItemMetadata } from "./M4ItemMetadata";
import { com_meta4_js_shared_M4LoadStatus } from "./M4LoadStatus";
import { com_meta4_js_client_M4NodeMetadata } from "./M4NodeMetadata";

// tslint:disable-next-line: class-name
export class com_meta4_js_client_M4Node {
    protected _ref: any;
  
    public constructor(ref: any) {
      this._ref = ref;
    }
  
    public count(): number {
      return this._ref.count();
    }
  
    public register(arg0: number, arg1: any, arg2: any): boolean {
      return this._ref.register(arg0, arg1, arg2);
    }
  
    public getObject(): com_meta4_js_client_M4Object {
      return new com_meta4_js_client_M4Object(this._ref.getObject());
    }
  
    public getValue(arg0: string, arg1?: number): any {
      return this._ref.getValue(arg0, arg1);
    }
  
    public setValue(arg0: string, arg1: any): void {
      this._ref.setValue(arg0, arg1);
    }
  
    public getCurrent(): number {
      return this._ref.getCurrent();
    }
  
    public getParentNode(): com_meta4_js_client_M4Node {
      return new com_meta4_js_client_M4Node(this._ref.getParentNode());
    }
  
    public isToDelete(): boolean {
      return this._ref.isToDelete();
    }
  
    public checkIsElement(arg0: string): boolean {
      return this._ref.checkIsElement(arg0);
    }
  
    public getNMethods(): number {
      return this._ref.getNMethods();
    }
  
    public getItemMetadata(arg0: string): com_meta4_js_client_M4ItemMetadata {
      return new com_meta4_js_client_M4ItemMetadata(
        this._ref.getItemMetadata(arg0)
      );
    }
  
    public getNElements(): number {
      return this._ref.getNElements();
    }
  
    public getNItems(): number {
      return this._ref.getNItems();
    }
  
    public getValuePlain(arg0: string, arg1: number): any {
      return this._ref.getValuePlain(arg0, arg1);
    }
  
    public getValues(arg0: string[], arg1: number): any[] {
      return this._ref.getValues(arg0, arg1);
    }
  
    public moveToRecordId(arg0: number): void {
      this._ref.moveToRecordId(arg0);
    }
  
    public getLoadStatus(): com_meta4_js_shared_M4LoadStatus {
      return new com_meta4_js_shared_M4LoadStatus(this._ref.getLoadStatus());
    }
  
    public isModified(): boolean {
      return this._ref.isModified();
    }
  
    public getNodeValues(arg0: string[], arg1: number[]): any[] {
      return this._ref.getNodeValues(arg0, arg1);
    }
  
    public getValuesPlain(arg0: string[], arg1: number): any[] {
      return this._ref.getValuesPlain(arg0, arg1);
    }
  
    public addRecord(): void {
      this._ref.addRecord();
    }
  
    public getNodeMetadata(): com_meta4_js_client_M4NodeMetadata {
      return new com_meta4_js_client_M4NodeMetadata(this._ref.getNodeMetadata());
    }
  
    public isNew(): boolean {
      return this._ref.isNew();
    }
  
    public getRecordId(arg0: number): number {
      return this._ref.getRecordId(arg0);
    }
  
    public unRegister(arg0: number, arg1: any): boolean {
      return this._ref.unRegister(arg0, arg1);
    }
  
    public registerById(
      arg0: number,
      arg1: string,
      arg2: any,
      arg3: any
    ): boolean {
      return this._ref.registerById(arg0, arg1, arg2, arg3);
    }
  
    public moveTo(arg0: number): void {
      this._ref.moveTo(arg0);
    }
  
    public moveToEOF(): void {
      this._ref.moveToEOF();
    }
  
    public setToDelete(): void {
      this._ref.setToDelete();
    }
  
    public unRegisterById(arg0: number, arg1: string): boolean {
      return this._ref.unRegisterById(arg0, arg1);
    }
  
    public getMethodMetadata(arg0: string): com_meta4_js_client_M4ItemMetadata {
      return new com_meta4_js_client_M4ItemMetadata(
        this._ref.getMethodMetadata(arg0)
      );
    }
  
    public getMethodMetadataByIndex(
      arg0: number
    ): com_meta4_js_client_M4ItemMetadata {
      return new com_meta4_js_client_M4ItemMetadata(
        this._ref.getMethodMetadataByIndex(arg0)
      );
    }
  
    public unRegisterByPrefix(arg0: string, arg1: number): boolean {
      return this._ref.unRegisterByPrefix(arg0, arg1);
    }
  
    public getCurrentRecordId(): number {
      return this._ref.getCurrentRecordId();
    }
  
    public getElementMetadataByIndex(
      arg0: number
    ): com_meta4_js_client_M4ItemMetadata {
      return new com_meta4_js_client_M4ItemMetadata(
        this._ref.getElementMetadataByIndex(arg0)
      );
    }
  
    public getElementMetadata(arg0: string): com_meta4_js_client_M4ItemMetadata {
      return new com_meta4_js_client_M4ItemMetadata(
        this._ref.getElementMetadata(arg0)
      );
    }
  
    public getItemMetadataByIndex(
      arg0: number
    ): com_meta4_js_client_M4ItemMetadata {
      return new com_meta4_js_client_M4ItemMetadata(
        this._ref.getItemMetadataByIndex(arg0)
      );
    }
  
    public getId(): string {
      return this._ref.getId();
    }
  
    public getParentId(): string {
      return this._ref.getParentId();
    }
  }