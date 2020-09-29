export class com_meta4_js_shared_M4LoadStatus {
  protected _ref: any;

  public constructor(ref: any) {
    this._ref = ref;
  }

  public getLastLoadRows(): number {
    return this._ref.getLastLoadRows();
  }

  public getLastLoadStatus(): number {
    return this._ref.getLastLoadStatus();
  }

  public getLastLoadFetchs(): number {
    return this._ref.getLastLoadFetchs();
  }
}
