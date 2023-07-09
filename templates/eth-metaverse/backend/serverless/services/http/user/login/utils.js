const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const cognitoidentity = new AWS.CognitoIdentity();

const crypto = require("crypto");
const Web3 = require("web3");

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://mainnet.infura.io/v3/4b75835b483b4ad1818bb6dd981ee25a"
  )
);

module.exports = {
  validateSig: async (address, signature, nonce) => {
    const message = `Welcome message, nonce: ${nonce}`;
    const hash = web3.utils.sha3(message);
    const signing_address = await web3.eth.accounts.recover(hash, signature);
    return signing_address.toLowerCase() === address.toLowerCase();
  },
  getIdToken: (address) => {
    const param = {
      IdentityPoolId: process.env.cognito_identity_pool_id,
      Logins: {},
    };
    param.Logins[process.env.domain_name] = address;
    return cognitoidentity.getOpenIdTokenForDeveloperIdentity(param).promise();
  },
  getCredentials: (identityId, cognitoOpenIdToken) => {
    const params = {
      IdentityId: identityId,
      Logins: {},
    };
    params.Logins["cognito-identity.amazonaws.com"] = cognitoOpenIdToken;
    return cognitoidentity.getCredentialsForIdentity(params).promise();
  },
  deleteData: async (address, oldNonce) => {
    let deleteParams = {
      TableName: process.env.user_table_id,
      Key: {
        address: address,
        nonce: oldNonce,
      },
    };
    let deletion = await dynamoDb.delete(deleteParams).promise();
    return deletion;
  },
  updateNonce: async (address, oldNonce) => {
    const nonce = crypto.randomBytes(16).toString("hex");

    const putParams = {
      Item: {
        address: address,
        nonce: nonce,
      },
      TableName: process.env.user_table_id,
    };

    const setData = () => dynamoDb.put(putParams).promise();
    await module.exports.deleteData(address, oldNonce);
    return await setData();
  },
};
