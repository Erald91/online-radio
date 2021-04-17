import { IDocumentSchema } from '../helpers/BaseModel';
import { getIterableSchemaFields, getRequiredFields, getFieldKey, getMissingFields } from './schema';
import { pipe, filter, map } from '../../../helpers/common';

export default (document: object, schema: IDocumentSchema): Array<string> => {
  const requiredFields = pipe(
    getIterableSchemaFields,
    filter(getRequiredFields),
    map(getFieldKey)
  )(schema);
  return getMissingFields(requiredFields)(document);
};
