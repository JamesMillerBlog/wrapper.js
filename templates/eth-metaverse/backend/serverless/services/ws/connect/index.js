"use strict";
const AWS = require("aws-sdk");
const sts = new AWS.STS();

module.exports.handler = async (event, context, callback) => {
  console.log("Auth function invoked");

  const queryString = event.queryStringParameters["X-Amz-Credential"];
  const accessKeyId = queryString.substring(0, queryString.indexOf("/"));

  try {
    await sts.getAccessKeyInfo({ AccessKeyId: accessKeyId }).promise();
    console.log(`The accessKeyId ${accessKeyId} is valid`);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `The accessKeyId is valid`,
      }),
    };
  } catch (err) {
    console.error(`The accessKeyId ${accessKeyId} is invalid`);
    return { statusCode: 500, body: JSON.stringify({ error: err }) };
  }
};
