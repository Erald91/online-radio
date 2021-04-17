import { pipe, filter, map, concat } from '../../../helpers/common';
import { getIterableSchemaFields, getUniqueFields, parseFieldsToIndexes, addIndexOptions } from './schema';
import { IDocumentSchema, IModelOptions } from '../helpers/BaseModel';

export default (schema: IDocumentSchema, modelOptions: IModelOptions) => {
  return pipe(
    getIterableSchemaFields,
    filter(getUniqueFields),
    map(parseFieldsToIndexes),
    map(addIndexOptions({unique: true, background: modelOptions.buildIndexesInBackground})),
    concat(
      map(addIndexOptions({background: modelOptions.buildIndexesInBackground}))(modelOptions.indexes || [])
    )
  )(schema);
};
