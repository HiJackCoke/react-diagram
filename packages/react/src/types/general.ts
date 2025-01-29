import { ErrorMessageCode } from '@diagram/core';

export type OnError = (id: ErrorMessageCode, message?: string) => void;
