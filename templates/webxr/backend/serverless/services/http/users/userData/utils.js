const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { users_table_id } = process.env;

module.exports = async (uid) => {
  const getParams = {
    TableName: users_table_id,
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
