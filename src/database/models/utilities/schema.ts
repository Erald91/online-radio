import { IDocumentFieldOptions, IDocumentSchema, IDocumentType} from '../helpers/BaseModel';
import { IndexSpecification } from 'mongodb';
import { objectEntries } from '../../../helpers/common';

export const hasValidSchema = (schema: IDocumentSchema): boolean => !!Object.keys(schema).length;

export const getIterableSchemaFields = (schema: IDocumentSchema): Array<[string, IDocumentFieldOptions]> => objectEntries(schema);

// Mapping
export const parseFieldsToIndexes = (iterable: [string, IDocumentFieldOptions]): IndexSpecification => ({key: {[iterable[0]]: 1}});
export const addIndexOptions = (options: Partial<IndexSpecification> = {}) => (input: object) => ({...input, options});

// Filtering
export const getUniqueFields = (iterable: [string, IDocumentFieldOptions]) => iterable[1].unique;
export const getRequiredFields = (iterable: [string, IDocumentFieldOptions]) => iterable[1].required;
export const getFieldKey = (iterable: [string, IDocumentFieldOptions]) => iterable[0];

// Reducing
export const mapFieldWithType = (hash: {[field: string]: IDocumentType}, iterable: [string, IDocumentFieldOptions]) => ({...hash, [iterable[0]]: iterable[1].type});

export const getMissingFields = (fields: Array<string>) => (document: object) => fields.filter((field: string) => Object.keys(document).indexOf(field) === -1);
export const getUndefinedFields = (allowedFields: Array<string>) => (document: object) => Object.keys(document).filter((field: string) => allowedFields.indexOf(field) === -1);
