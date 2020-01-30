import { M4Request } from "./M4Request";

export interface M4Executor {
    logon(user: string, password: string, language: string, onSuccess: CallableFunction , onFail: CallableFunction): void
    logout(onSuccess: CallableFunction , onError: CallableFunction): void
    loadMetadata(m4objects: string[], onSuccess: CallableFunction, onFail: CallableFunction): void
    execute(request: M4Request, onSuccess: CallableFunction, onFail: CallableFunction): void
}