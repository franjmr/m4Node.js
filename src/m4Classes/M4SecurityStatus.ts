// tslint:disable-next-line: class-name
export class com_meta4_js_shared_M4SecurityStatus {
  protected _ref: any;

  public constructor(ref: any) {
    this._ref = ref;
  }

  public canExecute(): boolean {
    return this._ref.canExecute();
  }

  public canRead(): boolean {
    return this._ref.canRead();
  }

  public canWrite(): boolean {
    return this._ref.canWrite();
  }

  public mustAuthenticate(): boolean {
    return this._ref.mustAuthenticate();
  }

  public isEncrypted(): boolean {
    return this._ref.isEncrypted();
  }
}
