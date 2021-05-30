// Pipe functionality
export const pipe = <T>(...func: Array<Function>) => (data: T) => [...func].reduce((result, func) => func(result), data);

// Extend functionality
export const extend = (parent: Function, child: Function) => (...args: Array<any>) => child(parent(...args)); 

// Grouping 'filter' related common functionalities
export const filter = <T>(callback: (item: T, index: number) => boolean) => (collection: Array<T>) => collection.filter(callback);
export const isTruthy = <T>(item: T) => !!item;

// Concat functionality
export const concat = <T>(...collections: Array<Array<T>>) => (initArray: Array<T>): Array<T> => initArray.concat(...collections);

// Mapping functionality
export const map = <T>(callback: (item: T, index: number) => any) => (collection: Array<T>): Array<any> => collection.map(callback);

// Find functionality
export const find = <T>(callback: (item: T, index: number) => any) => (collection: Array<T>): T => collection.find(callback);

// Reduce functionality
export const reduce = <T>(callback: (acc: any, item: T, index: number) => any, acc: any) => (collection: Array<T>) => collection.reduce(callback, acc);

export const objectEntries = (data: object): Array<[string, any]> => Object.entries(data); 
export const isNull = (value: any) => value === null;
