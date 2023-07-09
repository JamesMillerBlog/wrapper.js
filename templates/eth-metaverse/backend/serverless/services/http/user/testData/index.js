"use strict";
const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
// const seed = require('./seed.json');

const { user_table_id } = process.env;

module.exports.handler = async (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(await getAll()),
  };
  callback(null, response);
};

const getUserDetails = async (uid) => {
  const getParams = {
    TableName: user_table_id,
  };
  let users = await dynamoDb.scan(getParams).promise();
  let chosenUser;
  for (let x = 0; x < users.Items.length; x++) {
    if (users.Items[x].uid == uid) {
      chosenUser = users.Items[x];
    }
  }
  return chosenUser;
};

const getAll = async () => {
  let users = await dynamoDb
    .scan({
      TableName: user_table_id,
    })
    .promise();
  return users;
};

// const data = async (address) => {
//   if (cognito == "returnAll") {
//     return await getAll();
//   }
//   const putParams = {
//     Item: {
//       uid: username,
//       role: role,
//       username: username,
//       image: "jamesmiller.png",
//     },
//     TableName: user_table_id,
//   };
//   const putUserData = () => dynamoDb.put(putParams).promise();
//   let userDetails = await getUserDetails(username);
//   if (!userDetails) {
//     await putUserData();
//   }
//   return await getUserDetails(username);
// };
