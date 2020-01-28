export interface M4Executor {
    logon(user: string, pass: string, lang: string, onSuccess: CallableFunction , onError: CallableFunction): void
    logout(onSuccess: CallableFunction , onError: CallableFunction):void
    loadMetadata(m4objects: string[], onSuccess: CallableFunction , onError: CallableFunction): void
    execute(request: object, onSuccess: CallableFunction , onError: CallableFunction): void
}