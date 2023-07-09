"use strict";
// const util = require('util')
const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const {
  IS_OFFLINE,
  positions_table_id,
  domain_name,
  connections_table_id,
  api_local_ip_address,
  local_api_ws_port,
} = process.env;

module.exports.handler = async (event, context) => {
  const localUrl = `https://${api_local_ip_address}:${local_api_ws_port}`;
  const liveUrl = `https://ws.${domain_name}`;
  const socketUrl = IS_OFFLINE ? localUrl : liveUrl;

  const apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: socketUrl,
  });

  console.log(
    `https://${event.requestContext.domainName}/${event.requestContext.stage}`
  );

  const connectionId = event.requestContext.connectionId;
  console.log(`connectionid is the ${connectionId}`);

  const data = JSON.parse(event.body).data;

  const positionData = await returnPositionData(data, positions_table_id);

  await broadcastMessage(connectionId, positionData, apiGatewayManagementApi);

  return {
    statusCode: 200,
  };
};

async function broadcastMessage(
  senderConnectionId,
  positionData,
  apiGatewayManagementApi
) {
  const connections = await getAllConnections();

  await Promise.all(
    connections.Items.map(async (connection) => {
      const connectionId = connection.connectionId;

      if (connectionId !== senderConnectionId) {
        try {
          await apiGatewayManagementApi
            .postToConnection({
              ConnectionId: connectionId,
              Data: JSON.stringify(positionData),
            })
            .promise();
        } catch (error) {
          console.error(
            "Failed to send message to connection",
            connectionId,
            error
          );
        }
      }
    })
  );
}

const getAllConnections = async () =>
  await dynamoDb
    .scan({
      TableName: connections_table_id,
    })
    .promise();

const returnPositionData = async (posData, positions_table_id) => {
  const { type, uid, data } = posData;
  if (data != "") {
    const putParams = {
      Item: {
        type: type,
        uid: uid,
        data: data,
      },
      TableName: positions_table_id,
    };
    dynamoDb.put(putParams).promise();

    // return nothing and post to dynamo
    await dynamoDb.put(putParams).promise();
  }
  // return all data
  const getParams = {
    TableName: positions_table_id,
  };
  const result = await dynamoDb.scan(getParams).promise();
  return result.Items;
};
