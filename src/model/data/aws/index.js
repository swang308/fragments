const logger = require('../../../logger');
const s3Client = require('./s3Client');
const ddbDocClient = require('./ddbDocClient');
const {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand
} = require('@aws-sdk/client-s3');

const {
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand
} = require('@aws-sdk/lib-dynamodb');

// Helper function: Convert a stream into a Buffer
const streamToBuffer = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });

/**
 * Write a fragment to DynamoDB
 * @param {Object} fragment
 * @returns {Promise<void>}
 */
async function writeFragment(fragment) {
  const params = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
    Item: fragment,
  };

  console.log("DynamoDB PutCommand params:", params);

  // Create a PUT command to send to DynamoDB
  const command = new PutCommand(params);

  try {
    return ddbDocClient.send(command);
  } catch (err) {
    logger.warn({ err, params, fragment }, 'error writing fragment to DynamoDB');
    throw err;
  }
}

/**
 * Read a fragment from DynamoDB
 * @param {string} ownerId
 * @param {string} id
 * @returns {Promise<Object|undefined>}
 */
// Reads a fragment from DynamoDB. Returns a Promise<fragment|undefined>
async function readFragment(ownerId, id) {
  // Configure our GET params, with the name of the table and key (partition key + sort key)
  const params = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
    Key: { ownerId, id },
  };

  // Create a GET command to send to DynamoDB
  const command = new GetCommand(params);

  try {
    // Wait for the data to come back from AWS
    const data = await ddbDocClient.send(command);
    // We may or may not get back any data (e.g., no item found for the given key).
    // If we get back an item (fragment), we'll return it.  Otherwise we'll return `undefined`.
    return data?.Item;
  } catch (err) {
    logger.warn({ err, params }, 'error reading fragment from DynamoDB');
    throw err;
  }
}


/**
 * Write a fragment's data to S3
 * @param {string} ownerId
 * @param {string} id
 * @param {Buffer|string} data
 * @returns {Promise<void>}
 */
async function writeFragmentData(ownerId, id, data) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${ownerId}/${id}`,
    Body: data,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
  } catch (err) {
    logger.error({ err, params }, 'Error uploading fragment data to S3');
    throw new Error('Unable to upload fragment data');
  }
}

/**
 * Read a fragment's data from S3
 * @param {string} ownerId
 * @param {string} id
 * @returns {Promise<Buffer>}
 */
async function readFragmentData(ownerId, id) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${ownerId}/${id}`,
  };

  try {
    const data = await s3Client.send(new GetObjectCommand(params));
    return streamToBuffer(data.Body);
  } catch (err) {
    logger.error({ err, params }, 'Error reading fragment data from S3');
    throw new Error('Unable to read fragment data');
  }
}

/**
 * List fragments for a given user
 * @param {string} ownerId
 * @param {boolean} expand
 * @returns {Promise<Array<Object|string>>}
 */
// Get a list of fragments, either ids-only, or full Objects, for the given user.
// Returns a Promise<Array<Fragment>|Array<string>|undefined>
async function listFragments(ownerId, expand = false) {
  logger.debug(`Querying fragments for ownerId: ${ownerId}`);
  // Configure our QUERY params, with the name of the table and the query expression
  const params = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
    // Specify that we want to get all items where the ownerId is equal to the
    // `:ownerId` that we'll define below in the ExpressionAttributeValues.
    KeyConditionExpression: 'ownerId = :ownerId',
    // Use the `ownerId` value to do the query
    ExpressionAttributeValues: {
      ':ownerId': ownerId,
    },
  };

  // Limit to only `id` if we aren't supposed to expand. Without doing this
  // we'll get back every attribute.  The projection expression defines a list
  // of attributes to return, see:
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ProjectionExpressions.html
  if (!expand) {
    params.ProjectionExpression = 'id';
  }

  // Create a QUERY command to send to DynamoDB
  const command = new QueryCommand(params);

  try {
    // Wait for the data to come back from AWS
    const data = await ddbDocClient.send(command);
    logger.debug(`DynamoDB Query Result: ${JSON.stringify(data)}`);
    // If we haven't expanded to include all attributes, remap this array from
    // [ {"id":"b9e7a264-630f-436d-a785-27f30233faea"}, {"id":"dad25b07-8cd6-498b-9aaf-46d358ea97fe"} ,... ] to
    // [ "b9e7a264-630f-436d-a785-27f30233faea", "dad25b07-8cd6-498b-9aaf-46d358ea97fe", ... ]
    return !expand ? data?.Items.map((item) => item.id) : data?.Items
  } catch (err) {
    logger.error({ err, params }, 'error getting all fragments for user from DynamoDB');
    throw err;
  }
}

/**
 * Delete a fragment from S3 and DynamoDB
 * @param {string} ownerId
 * @param {string} id
 * @returns {Promise<void>}
 */
async function deleteFragment(ownerId, id) {
  const s3Params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${ownerId}/${id}`,
  };

  const ddbParams = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
    Key: { ownerId, id },
  };

  try {
    await Promise.all([
      ddbDocClient.send(new DeleteCommand(ddbParams)),
      s3Client.send(new DeleteObjectCommand(s3Params)),
    ]);
  } catch (err) {
    logger.error({ err, s3Params, ddbParams }, 'Error deleting fragment');
    throw new Error('Unable to delete fragment');
  }
}

// Exporting the functions
module.exports = {
  listFragments,
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
  deleteFragment,
};
