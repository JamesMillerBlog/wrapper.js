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
    body: JSON.stringify(await data(event.body.user)),
  };
  callback(null, response);
};

const data = async (user) => {
  const putParams = {
    Item: {
      uid: user.username,
      role: user.role,
      avatar: user.avatar,
      userMode: user.userMode,
      username: user.username,
      image: user.image,
    },
    TableName: users_table_id,
  };

  await dynamoDb.put(putParams).promise();

  return await getUserDetails(user.username);
};
