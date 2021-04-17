import { IDocumentSchema } from '../helpers/BaseModel';
import { getIterableSchemaFields, getFieldKey, getUndefinedFields } from './schema';
import { pipe, map } from '../../../helpers/common';

export default (document: object, schema: IDocumentSchema) => {
  const schemaFields = pipe(
    getIterableSchemaFields,
    map(getFieldKey)
  )(schema);
  return getUndefinedFields(schemaFields)(document);
};
