"use strict";
const util = require("util");
const AWS = require("aws-sdk");

module.exports.handler = async (event, context) => {
  // const domain = event.requestContext.domainName;
  // let newDomain = (domain == 'localhost') ? '192.168.1.120:3001': domain;
  const {
    IS_OFFLINE,
    domain_name,
    stage,
    api_local_ip_address,
    local_api_ws_port,
  } = process.env;
  const localUrl = `https://${api_local_ip_address}:${local_api_ws_port}`;
  const liveUrl = `https://ws.${domain_name}`;
  const socketUrl = IS_OFFLINE ? localUrl : liveUrl;
  // const socketUrl = `https://${event.requestContext.domainName}/${event.requestContext.stage}`
  // const stage = event.requestContext.stage;
  // let newStage = `${stage}/sockets/test`
  // const connectionId = event.requestContext.connectionId;
  // const callbackUrlForAWS = util.format(util.format('http://%s/%s', newDomain, newStage)); //construct the needed url
  // console.log(`https://${event.requestContext.domainName}/${event.requestContext.stage}`);
  // console.log(callbackUrlForAWS)
  console.log(
    `https://${event.requestContext.domainName}/${event.requestContext.stage}`
  );
  // await sendMessageToClient(callbackUrlForAWS, connectionId, event);
  let connectionId = event.requestContext.connectionId;
  console.log(`connectionid is the ${connectionId}`);
  const client = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: socketUrl,
  });
  // endpoint: `https://${event.requestContext.domainName}/${event.requestContext.stage}`
  await client
    .postToConnection({
      ConnectionId: event.requestContext.connectionId,
      Data: event.body,
    })
    .promise();

  return {
    statusCode: 200,
  };
};
