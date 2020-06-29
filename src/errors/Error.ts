import { IError } from "./IError";

export const Error = (message: string, name: string = 'Error'): IError => ({
  message,
  name
});
