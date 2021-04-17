import { IDocumentSchema, IDocumentType } from '../helpers/BaseModel';
import { pipe, reduce, objectEntries, find, isNull } from '../../../helpers/common';
import { getIterableSchemaFields, mapFieldWithType } from './schema';

export default (document: object, schema: IDocumentSchema) => {
  // Get object mapping field and assigned type from Schema
  const getFieldTypeMapping = pipe(
    getIterableSchemaFields,
    reduce(mapFieldWithType, {})
  )(schema);
  // Define comparing functionality to validate type
  const checkTypeCallback = ([field, value]) => {
    const assignedTypeFromSchema = getFieldTypeMapping[field];
    let hasMissMatch = false;
    switch (assignedTypeFromSchema) {
      case IDocumentType.Array:
        hasMissMatch = !isNull(value) && !Array.isArray(value) ? true : false;
        break;
      case IDocumentType.Boolean:
        hasMissMatch = !isNull(value) && typeof value !== 'boolean' ? true : false;
        break;
      case IDocumentType.Number:
        hasMissMatch = !isNull(value) && typeof value !== 'number' ? true : false;
        break;
      case IDocumentType.String:
        hasMissMatch = !isNull(value) && typeof value !== 'string' ? true : false;
        break;
      case IDocumentType.Date:
        hasMissMatch = !isNull(value) && !(value instanceof Date) ? true : false;
        break;
      default:
        hasMissMatch = true;
    }
    return hasMissMatch;
  }
  return pipe(objectEntries, find(checkTypeCallback))(document);
};
