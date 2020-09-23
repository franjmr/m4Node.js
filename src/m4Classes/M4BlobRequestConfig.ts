// tslint:disable-next-line: class-name
export class com_meta4_js_client_M4BlobRequestConfig {
    protected _ref: any;
  
    public constructor(ref?: any) {
      if (ref) {
        this._ref = ref;
      } else {
        this._ref = new window.meta4.M4BlobRequestConfig();
      }
    }
  
    public getReference() {
      return this._ref;
    }
  
    public getFileName(): string {
      return this._ref.getFileName();
    }
  
    public setInline(arg0: boolean): void {
      this._ref.setInline(arg0);
    }
  
    public isInline(): boolean {
      return this._ref.isInline();
    }
  
    public setFileName(arg0: string): void {
      this._ref.setFileName(arg0);
    }
  
    public getURIParams(): string {
      return this._ref.getURIParams();
    }
  
    public isNoCache(): boolean {
      return this._ref.isNoCache();
    }
  
    public setNoCache(arg0: boolean): void {
      this._ref.setNoCache(arg0);
    }
  }
  