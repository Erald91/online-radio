import { IError } from './IError';
import { Error } from './Error';

export const ResponseError = (message: string, status: number, name: string = null): IError => {
  const error = Error.call(this, message, name);
  return {...error, status};
};
