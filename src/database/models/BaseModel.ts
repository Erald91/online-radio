import { Db, IndexSpecification } from 'mongodb';

enum IDocumentType {
  String,
  Number,
  Array,
  Boolean
};

interface IDocumentFieldConfig {
  [field: string]: {
    type: IDocumentType;
    required?: boolean;
    unique?: boolean;
    default?: any;
  }
}

type IIndexConfig = {
  [field: string]: number; // 1 or -1
};

interface IModelOptions {
  indexes?: Array<IIndexConfig>;
  buildIndexesInBackground?: boolean;
}

const BaseModel = (name: string, documentBluprint: IDocumentFieldConfig, modelOptions: IModelOptions = {}) => (db: Db) => {
  const collection = db.collection(name);

  if (!documentBluprint.length) {
    throw new Error(`Document blueprint for collection ${name} is not valid, it should have at least 1 field definition.`);
  }

  // Check unique fields that we need to add and concat with additional compound indexes
  const indexes: Array<IndexSpecification> = Object.entries(documentBluprint)
    .map(([field, options]) => {
      return options.unique
        ? {key: {[field]: 1}, unique: true, background: modelOptions.buildIndexesInBackground} as IndexSpecification
        : null;
    })
    .filter(indexConfig => indexConfig)
    .concat(
      (modelOptions.indexes || []).map((indexConfig: IIndexConfig) =>
        ({key: indexConfig, background: modelOptions.buildIndexesInBackground} as IndexSpecification)
      )
    );
  // Check if we have enough indexes data to proceed with creation
  if (indexes.length) {
    collection.createIndexes(indexes, (err) => {
      if (err) {
        console.error(`Indexes failed to be created for collection ${name}.`);
      } else {
        console.log(`Indexes created successfully for collection ${name}.`);
      }
    });
  }

  const _doesObjectMatchOnBluprint = (objectData: {[x: string]: any}) => {
    if (!Object.keys(objectData).length) {
      return false;
    }
    const providedKeys = Object.keys(objectData);
  };

  const _returnMissingRequiredFields = (objectData: {[x: string]: any}) => {
    // Get required fields from provided document blueprint
    const requiredFields = Object.entries(documentBluprint)
      // Include only fields that are marked as 'required'
      .filter(([field, option]) => option.required)
      // Return only the field value
      .map(([field, option]) => field);
    // Get list of properties provided
    const providedKeys = Object.keys(objectData);
    // Check if required fields are provided
    return requiredFields.filter((field: string) => {
      // Will return those fields which are marked as required,
      // but not found on current data or the value is falsy
      if (!providedKeys.includes(field) || (providedKeys.includes(field) && !objectData[field])) {
        return true;
      }
      return false;
    });
  };

  const _create = async (objectData: {[x: string]: any}) => {

    const missingRequiredFields = _returnMissingRequiredFields(objectData);
    if (missingRequiredFields.length) {
      return Promise.reject(`Fields ${missingRequiredFields.join(', ')} are required but are not provided.`);
    }
  };

  return {
    create: _create
  }
};
