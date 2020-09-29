export interface M4LogMessage {
    getCode(): string;
    getSeverity(): string;
    getDescription(): string;
    getTitle() : string;
    getMessage() : string;
    getErrorNumber(): number;
    getModule(): string;
    getSubModule(): string;
}