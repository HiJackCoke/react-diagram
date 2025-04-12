import { ErrorMessageCode } from 'cosmos-diagram';

export type OnError = (id: ErrorMessageCode, message?: string) => void;
