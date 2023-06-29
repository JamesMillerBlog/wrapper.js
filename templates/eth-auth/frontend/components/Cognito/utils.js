import { AwsClient } from "aws4fetch";
import Web3 from "web3";
import axios from "axios";
import { httpApiURL, isLive } from "../../utils";

const web3 = new Web3(Web3.givenProvider);

const getUserNonce = async (address) =>
  await axios({
    method: "post",
    url: `${httpApiURL}/signup/nonce`,
    data: {
      address: address,
    },
    headers: {
      "Content-Type": "application/json",
    },
  }).then(
    (res) => {
      const data = JSON.parse(res.data.body);
      return data;
    },
    (error) => {
      console.log(error);
    }
  );

const login = (nonce, signature, address) =>
  axios({
    method: "post",
    url: `${httpApiURL}/signup/login`,
    data: {
      nonce: nonce,
      signature: signature,
      address: address,
    },
    headers: {
      "Content-Type": "application/json",
    },
  }).then(
    (res) => {
      const data = JSON.parse(res.data.body);
      return data;
    },
    (error) => {
      console.log(error);
    }
  );

export const requestAccount = async (setCognito, setSignInState) => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const address = accounts[0];

      let data = await getUserNonce(address);
      const { nonce } = data;
      const signature = await web3.eth.personal.sign(
        web3.utils.sha3(`Welcome message, nonce: ${nonce}`),
        address
      );
      const { AccessKeyId, SecretKey, SessionToken, Expiration } = await login(
        nonce,
        signature,
        address
      );
      if (AccessKeyId && SecretKey && SessionToken && Expiration) {
        authenticateUser(
          setCognito,
          setSignInState,
          address,
          AccessKeyId,
          SecretKey,
          SessionToken,
          Expiration
        );
      }
    } catch (error) {
      //throw error
    }
  }
};

const authenticateUser = (
  setCognito,
  setSignInState,
  address,
  accessKeyId,
  secretAccessKey,
  sessionToken,
  expiration
) => {
  localStorage.setItem("address", JSON.stringify(address));
  localStorage.setItem("sessionToken", JSON.stringify(sessionToken));
  localStorage.setItem("accessKeyId", JSON.stringify(accessKeyId));
  localStorage.setItem("secretAccessKey", JSON.stringify(secretAccessKey));
  localStorage.setItem("expiration", JSON.stringify(expiration));

  const aws = new AwsClient({
    accessKeyId,
    secretAccessKey,
    sessionToken,
    region: process.env.region,
    service: "execute-api",
  });
  setCognito(aws);
  setSignInState("signedIn");
};

export const checkCredentials = (setCognito, setSignInState) => {
  const address = JSON.parse(localStorage.getItem("address") || null);
  const sessionToken = JSON.parse(localStorage.getItem("sessionToken") || null);
  const secretAccessKey = JSON.parse(
    localStorage.getItem("secretAccessKey") || null
  );
  const accessKeyId = JSON.parse(localStorage.getItem("accessKeyId") || null);
  const expiration = JSON.parse(localStorage.getItem("expiration") || null);
  const today = new Date();

  if (address && sessionToken && expiration) {
    if (new Date(expiration) > today) {
      // implement logic to update state to say user is logged in
      const aws = new AwsClient({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        sessionToken: `"${sessionToken}"`,
        region: process.env.region,
        service: "execute-api",
      });
      setCognito(aws);
      setSignInState("signedIn");
    } else {
      setSignInState("signedOut");
    }
  }
};

export const signOut = (setCognito, setSignInState) => {
  localStorage.clear();
  setCognito("");
  setSignInState("signedOut");
};

export const getData = async (cognito) => {
  try {
    let res;
    if (isLive()) {
      const request = await cognito.sign(`${httpApiURL}/signup/testData`, {
        method: "GET",
      });
      const response = await fetch(request);
      res = await response.json();
    } else {
      const response = await axios({
        method: "get",
        url: `${httpApiURL}/signup/testData`,
      });
      res = response.data;
    }
    return res;
  } catch (e) {
    console.error(e);
  }
};
