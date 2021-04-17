import { Collection as MongoCollection } from 'mongodb';
import { IDocumentSchema } from './BaseModel';
import { hasAllRequiredFields, hasWrongFieldType, hasNotDefinedFields } from '../utilities';

const Collection = (collection: MongoCollection, schema: IDocumentSchema) => {
  const _validateDocument = (document: object) => {
    // Check if all required fields are provided
    const missingRequiredFields = hasAllRequiredFields(document, schema);
    if (missingRequiredFields.length) {
      throw new Error(`The following fields are missing ${missingRequiredFields.join(', ')}.`);
    }
    // Check if document has fields that are not defined in the schema
    const notDefinedFields = hasNotDefinedFields(document, schema);
    if (notDefinedFields.length) {
      throw new Error(`Document has few fields that are not allowed by the schema: ${notDefinedFields.join(', ')}.`);
    }
    // Check if any of the fields doesn't have the type defined in the schema object
    const failedFieldTypeCheck = hasWrongFieldType(document, schema);
    if (failedFieldTypeCheck) {
      throw new Error(`Field ${failedFieldTypeCheck[0]} has different value (${failedFieldTypeCheck[1]}) from what defined in the schema.`);
    }
  };

  const _insertOne = async (document: object): Promise<any> => {
    try {
      // Make validation per document
      _validateDocument(document);
      return collection.insertOne(document);
    } catch (error) {
      return Promise.reject(error);
    }
  };
  
  const _insertMany = async (documents: Array<object>): Promise<any> => {
    try {
      if (!documents.length) {
        throw new Error(`Insert many argument should be an array with at least one item.`);
      }
      // Iterate to all documents and check for valid data
      (function validateDocuments(documents) {
        const document = documents.shift();
        if (!document) {
          return;
        }
        // Make validation per document
        _validateDocument(document);
        // Call recursively to process documents in the queue
        validateDocuments(documents);
      })([...documents]);
      return collection.insertMany(documents);
    } catch (error) {
      return Promise.reject(error)
    }
  }
  return {
    insertOne: _insertOne,
    insertMany: _insertMany
  }
};

export default Collection;
