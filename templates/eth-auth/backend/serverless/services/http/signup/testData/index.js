"use strict";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};
module.exports.handler = async (event) => {
  return {
    headers,
    statusCode: 200,
    body: JSON.stringify(
      "Hello!! This is test data that you are pulling from the Back End, based on your authenticated wallet!"
    ),
  };
};
