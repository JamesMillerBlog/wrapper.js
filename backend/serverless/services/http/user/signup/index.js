"use strict";
const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const crypto = require("crypto");

const { user_table_id } = process.env;

module.exports.handler = async (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(await data(event.body.address)),
  };
  callback(null, response);
};

const data = async (address) => {
  const nonce = crypto.randomBytes(16).toString("hex");
  const putParams = {
    Item: {
      address: address,
      nonce: nonce,
    },
    TableName: user_table_id,
  };
  const setData = () => dynamoDb.put(putParams).promise();
  let userDetails = await getData(address);
  if (!userDetails) {
    await setData();
  }
  return await getData(address);
};

const getData = async (address) => {
  const getParams = {
    TableName: user_table_id,
  };
  let users = await dynamoDb.scan(getParams).promise();
  let chosenUser;
  for (let x = 0; x < users.Items.length; x++) {
    if (users.Items[x].address == address) {
      chosenUser = users.Items[x];
    }
  }
  return chosenUser;
};
