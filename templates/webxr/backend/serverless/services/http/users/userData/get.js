"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { users_table_id } = process.env;
const getUserDetails = require("./utils");

module.exports.handler = async (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(await data(event.query.uuid)),
  };
  callback(null, response);
};

const data = async (uuid) => {
  if (uuid) {
    const putParams = {
      Item: {
        uid: uuid,
        role: null,
        avatar: null,
        userMode: "image",
        username: uuid,
        image: "jamesmiller.png",
      },
      TableName: users_table_id,
    };
    const putUserData = () => dynamoDb.put(putParams).promise();
    let userDetails = await getUserDetails(uuid);
    if (!userDetails) {
      await putUserData();
    }
    const data = await getUserDetails(uuid);
    return data;
  } else {
    const getParams = {
      TableName: users_table_id,
    };
    const data = await dynamoDb.scan(getParams).promise();
    return data;
  }
};
