/**
 * Transactional request and response data contracts conforming to
 * Constitution_Brendup.md (Title III: Protocolo de Comunicación y Modelo Transaccional).
 * Pure data structures without methods.
 */

export interface RequestBase {
  UserID: string;
  Token: string;
  Signature: string;
}

export interface RequestEmpty extends RequestBase {}

export interface RequestObject<T> extends RequestBase {
  Content: T;
}

export interface ResponseBase {
  CodeNumber: number;
  CodeName: string;
  Message: string | null;
  ErrorNumber: number | null;
  ServerName: string;
}

export interface ResponseEmpty extends ResponseBase {}

export interface ResponseObject<T> extends ResponseBase {
  Result: T | null;
}
