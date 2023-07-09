"use strict";

const {
  getIdToken,
  getCredentials,
  validateSig,
  updateNonce,
} = require("./utils.js");

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

module.exports.handler = async (event) => {
  const { nonce, address, signature } = event.body;
  const sigValidated = await validateSig(address, signature, nonce);
  if (sigValidated) {
    const { IdentityId: identityId, Token: token } = await getIdToken(address);

    // console.log("identityId", identityId);
    // console.log("token", token);

    const { Credentials: credentials } = await getCredentials(
      identityId,
      token
    );

    // console.log('credentials', credentials);
    await updateNonce(address, nonce);

    return {
      headers,
      statusCode: 200,
      body: JSON.stringify(credentials),
    };
  }
  return {
    statusCode: 401,
    headers,
    body: JSON.stringify({ login: false }),
  };
};
