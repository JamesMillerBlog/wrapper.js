'use strict';
const util = require('util')
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context) => {
  const {IS_OFFLINE, chat_table_id, domain_name, stage, api_local_ip_address, local_api_ws_port} = process.env; 
  const localUrl = `http://${api_local_ip_address}:${local_api_ws_port}`;
  const liveUrl = `https://ws.${domain_name}`;
  const socketUrl = (IS_OFFLINE) ? localUrl: liveUrl;

  console.log(`https://${event.requestContext.domainName}/${event.requestContext.stage}`)
  // await sendMessageToClient(callbackUrlForAWS, connectionId, event);
  let connectionId = event.requestContext.connectionId;
  console.log(`connectionid is the ${connectionId}`)
  const client = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: socketUrl
  });

  const chatData = JSON.parse(event.body).data;

  await client
    .postToConnection({
      ConnectionId: event.requestContext.connectionId,
      Data: JSON.stringify(await returnChatData(chatData, chat_table_id))
    })
    .promise();
  
  return {
    statusCode: 200,
  };
};

const returnChatData = async(chatData, chat_table_id) => {
  
  if(typeof chatData == "string") {
    const { roomId, updateTime, author, message, role} = JSON.parse(chatData);
    const putParams = {
      Item: {
        roomId: String(roomId),
        updateTime: String(updateTime),
        author: author,
        message: message,
        role: role
      },
      TableName: chat_table_id
    };
    // dynamoDb.put(putParams).promise();
  
    // return nothing and post to dynamo
    await dynamoDb.put(putParams).promise();
  }
  // return all data
  const getParams = {
    TableName: chat_table_id
  };
  const result = await dynamoDb.scan(getParams).promise();
  return result.Items;
}