import { com_meta4_js_shared_M4SecurityStatus } from "./M4SecurityStatus";

enum com_meta4_js_shared_M4ItemType {
  NONE = 0,
  METHOD = 1,
  PROPERTY = 2,
  FIELD = 3,
  CONCEPT = 4,
}

enum com_meta4_js_shared_M4DataNode_ItemScope {
  NONE = 0,
  NODE = 1,
  BLOCK = 2,
  RECORD = 3,
}

// tslint:disable-next-line: class-name
export class com_meta4_js_client_M4ItemMetadata {
  protected _ref: any;

  public constructor(ref: any) {
    this._ref = ref;
  }

  public getType(): com_meta4_js_shared_M4ItemType {
    return this._ref.getType().getOrdinal();
  }

  public getScope(): com_meta4_js_shared_M4DataNode_ItemScope {
    return this._ref.getScope().getOrdinal();
  }

  public getM4Type(): number {
    return this._ref.getM4Type();
  }

  public isAffectsDB(): boolean {
    return this._ref.isAffectsDB();
  }

  public isExecutable(): boolean {
    return this._ref.isExecutable();
  }

  public getAuxiliarItem(): string {
    return this._ref.getAuxiliarItem();
  }

  public getInternalType(): number {
    return this._ref.getInternalType();
  }

  public isVariableArgs(): boolean {
    return this._ref.isVariableArgs();
  }

  public getNArgs(): number {
    return this._ref.getNArgs();
  }

  public getArgM4TypeByIndex(arg0: number): number {
    return this._ref.getArgM4TypeByIndex(arg0);
  }

  public getSecurityStatus(): com_meta4_js_shared_M4SecurityStatus {
    return new com_meta4_js_shared_M4SecurityStatus(
      this._ref.getSecurityStatus()
    );
  }

  public getProperty(arg0: string): string {
    return this._ref.getProperty(arg0);
  }

  public getId(): string {
    return this._ref.getId();
  }
}
