import { com_meta4_js_client_M4ObjectMetadata } from "./M4ObjectMetadata";
import { com_meta4_js_shared_M4DataProperties } from "./M4DataProperties";
import { com_meta4_js_client_M4NodeMetadata } from "./M4NodeMetadata";
import { com_meta4_js_client_M4Node } from "./M4Node";

// tslint:disable-next-line: class-name
export class com_meta4_js_client_M4Object {
  protected _ref: any;

  public constructor(ref: any) {
    this._ref = ref;
  }

  public getNode(arg0: string): com_meta4_js_client_M4Node {
    return new com_meta4_js_client_M4Node(this._ref.getNode(arg0));
  }

  public importFromString(arg0: string): void {
    this._ref.importFromString(arg0);
  }

  public getNNodes(): number {
    return this._ref.getNNodes();
  }

  public isInTransaction(): boolean {
    return this._ref.isInTransaction();
  }

  public exportToString(): string {
    return this._ref.exportToString();
  }

  public getNodeMetadataByIndex(
    arg0: number
  ): com_meta4_js_client_M4NodeMetadata {
    return new com_meta4_js_client_M4NodeMetadata(
      this._ref.getNodeMetadataByIndex(arg0)
    );
  }

  public getExternalSystemId(): string {
    return this._ref.getExternalSystemId();
  }

  public getObjectMetadata(): com_meta4_js_client_M4ObjectMetadata {
    return new com_meta4_js_client_M4ObjectMetadata(
      this._ref.getObjectMetadata()
    );
  }

  public getMetaIdentifier(): string {
    return this._ref.getMetaIdentifier();
  }

  public getProperties(): com_meta4_js_shared_M4DataProperties {
    return new com_meta4_js_shared_M4DataProperties(this._ref.getProperties());
  }

  public getId(): string {
    return this._ref.getId();
  }

  public release(): void {
    this._ref.release();
  }

  public isModified(): boolean {
    return this._ref.isModified();
  }

  public isReleased(): boolean {
    return this._ref.isReleased();
  }

  public isSync(): boolean {
    return this._ref.isSync();
  }

  public getAlias(): string {
    return this._ref.getAlias();
  }

  public getContextId(): string {
    return this._ref.getContextId();
  }

  public setContextId(arg0: string): void {
    this._ref.setContextId(arg0);
  }

  public isElevated(): boolean {
    return this._ref.isElevated();
  }
}
