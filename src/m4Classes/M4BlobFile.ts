import { com_meta4_js_client_M4BlobRequestConfig } from "./M4BlobRequestConfig";

// tslint:disable-next-line: class-name
export class com_meta4_js_client_M4BlobFile {
    protected _ref: any;
  
    public constructor(ref?: any) {
      if (ref) {
        this._ref = ref;
      } else {
        this._ref = new window.meta4.M4BlobFile();
      }
    }
  
    public getReference() {
      return this._ref;
    }
  
    public static getInstance(arg0: string): com_meta4_js_client_M4BlobFile {
      return new com_meta4_js_client_M4BlobFile(
        window.meta4.M4BlobFile.getInstance(arg0)
      );
    }
  
    public getSize(): number {
      return this._ref.getSize();
    }
  
    public getExtension(): string {
      return this._ref.getExtension();
    }
  
    public getDescription(): string {
      return this._ref.getDescription();
    }
  
    public getFileId(): string {
      return this._ref.getFileId();
    }
  
    public getURI(arg0: com_meta4_js_client_M4BlobRequestConfig): string {
      return this._ref.getURI(arg0.getReference());
    }
  }