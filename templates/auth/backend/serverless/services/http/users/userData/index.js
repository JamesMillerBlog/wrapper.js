'use strict';

module.exports.handler = async(event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: 'Hello World!! :D'
  };
  callback(null, response);
};