import { Db } from 'mongodb';
import { hasValidSchema, prepareIndexes } from '../utilities';
import Collection from './Collection';

export enum IDocumentType {
  String,
  Number,
  Array,
  Boolean,
  Date
};

export type IDocumentFieldOptions = {
  type: IDocumentType;
  required?: boolean;
  unique?: boolean;
}

export interface IDocumentSchema {
  [field: string]: IDocumentFieldOptions
}

export type IIndexConfig = {
  [field: string]: number; // 1 or -1
};

export interface IModelOptions {
  indexes?: Array<IIndexConfig>;
  buildIndexesInBackground?: boolean;
}

const BaseModel = (name: string, schema: IDocumentSchema, modelOptions: IModelOptions = {}) => async (db: Db)  => {
  const collection = db.collection(name);

  if (!hasValidSchema(schema)) {
    throw new Error(`Document schema for collection ${name} is not valid, it should have at least 1 field definition.`);
  }

  // Check unique fields that we need to add and concat with additional compound indexes
  const indexes = prepareIndexes(schema, modelOptions);
  console.log('Prepared indexes', indexes);
  // Check if we have enough indexes data to proceed with creation
  if (indexes.length) {
    try {
      await collection.createIndexes(indexes);
      console.log(`Indexes created successfully for collection ${name}.`);
    } catch (error) {
      console.error(`Indexes failed to be created for collection ${name}.`, error.stack);
    }    
  }

  return Collection(collection, schema);
};

export default BaseModel;
