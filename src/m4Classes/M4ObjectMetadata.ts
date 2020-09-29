// tslint:disable-next-line:class-name
export class com_meta4_js_client_M4ObjectMetadata {
  protected _ref: any;

  public constructor(ref: any) {
    this._ref = ref;
  }

  public getProperty(arg0: string): string {
    return this._ref.getProperty(arg0);
  }

  public getId(): string {
    return this._ref.getId();
  }
}
