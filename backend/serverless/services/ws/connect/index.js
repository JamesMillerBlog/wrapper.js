'use strict';
const util = require('util')
const AWS = require('aws-sdk');

const jose = require("node-jose");
// const fetch = require('node-fetch');
const axios = require('axios');


const {IS_OFFLINE, cognito_user_pool_id, cognito_user_pool_client_id, domain_name, region, api_local_ip_address, local_api_ws_port} = process.env; 
const localUrl = `http://${api_local_ip_address}:${local_api_ws_port}`;
const liveUrl = `https://ws.${domain_name}`;
const socketUrl = (IS_OFFLINE) ? localUrl: liveUrl;

module.exports.handler = async (event, context, callback) => {

  console.log('Auth function invoked');
  if (event.queryStringParameters == undefined) return context.fail("Unauthorized");
  const keys_url =
  `https://cognito-idp.${region}.amazonaws.com/${cognito_user_pool_id}/.well-known/jwks.json`;
    const {
      queryStringParameters: { token },
      methodArn
    } = event;

    if(token == undefined) return context.fail("Unauthorized");
    // const app_client_id = cognito_user_pool_client_id;
    const sections = token.split(".");
    if(sections.length < 3) return context.fail("Unauthorized");

    let authHeader = jose.util.base64url.decode(sections[0]);
    authHeader = JSON.parse(authHeader);
    const kid = authHeader.kid;
    const response = await axios.get(keys_url);
  
      const keys = response.data["keys"];
      let key_index = -1;
      keys.some((key, index) => {
          if (kid == key.kid) {
          key_index = index;
          }
      });
      const foundKey = keys.find(key => {
          return kid === key.kid;
      });

      if (!foundKey) {
          context.fail("Public key not found in jwks.json");
      }

      let results = async() => {
        return await new Promise((resolve, reject) => {     
          jose.JWK.asKey(foundKey).then(async function(result) {
              // verify the signature
              let value = async() => await jose.JWS.createVerify(result)
              .verify(token)
              .then(function(result) {
                // now we can use the claims
                const claims = JSON.parse(result.payload);
                if(claims != undefined) {
                  return true;
                } else {
                  return false;
                }
                // // additionally we can verify the token expiration
                // const current_ts = Math.floor(new Date() / 1000);
                // if (current_ts > claims.exp) {
                //   return context.fail("Token is expired");
                // }
                // // and the Audience (use claims.client_id if verifying an access token)
                // if (claims.aud != app_client_id) {
                //   return context.fail("Token was not issued for this audience");
                // }
                // return context.succeed(generateAllow("me", methodArn));
              })
              .catch(err => {
                value = false;
                return context.fail("Signature verification failed");
              });
              
              if (await value() == true) {
                return resolve('accept');
              } else {
                return reject('reject')
            }
          });
        });
      }

    let awaitedresults = await results();
    if(awaitedresults == 'reject') {
      callback("An error happened!");
    } else {
      let connectionId = event.requestContext.connectionId;
      console.log(`connectionid is the ${connectionId}`)
      const client = new AWS.ApiGatewayManagementApi({
        apiVersion: '2018-11-29',
        endpoint: socketUrl
      });
      return {
        statusCode: 200,
      };
    }
};