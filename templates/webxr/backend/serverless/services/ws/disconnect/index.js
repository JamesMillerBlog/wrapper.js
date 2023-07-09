const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { connections_table_id } = process.env;
module.exports.handler = async (event, context, callback) => {
  console.log("Disconnect function invoked");
  let connectionId = event.requestContext.connectionId;
  console.log(`connectionid is the ${connectionId}`);

  const param = {
    Key: {
      connectionId,
    },
    TableName: connections_table_id,
  };

  await dynamoDb.delete(param).promise();
  console.log(`${connectionId} is deleted`);
  return {
    statusCode: 200,
  };
};
