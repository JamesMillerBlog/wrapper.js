import React, { useEffect } from "react";
import cognitoStore from "../../stores/cognito";
import styled from "styled-components";
import { checkCredentials, requestAccount, signOut } from "./utils.js";
import { RadixDappToolkit } from "@radixdlt/radix-dapp-toolkit";

const Cognito = (props) => {
  const { children } = props;
  const { cognito, setCognito, signInState, setSignInState } = cognitoStore();

  // useEffect(() => {
  //   checkCredentials(setCognito, setSignInState);
  // }, []);

  useEffect(() => {
    if (signInState == "signOut") {
      signOut(setCognito, setSignInState);
    }
  }, [signInState]);

  return (
    <ContentWrapper>
      {cognito == "" && (
        // <Button onClick={() => requestAccount(setCognito, setSignInState)}>
        //   Sign in
        // </Button>
        <radix-connect-button />
      )}
      {cognito != "" && <>{children}</>}
    </ContentWrapper>
  );
};

const rdt = RadixDappToolkit(
  {
    dAppDefinitionAddress:
      "account_tdx_22_1pz7vywgwz4fq6e4v3aeeu8huamq0ctmsmzltay07vzpqm82mp5",
    dAppName: "Name of your dApp",
  },
  (requestData) => {
    requestData({
      accounts: { quantifier: "atLeast", quantity: 1 },
    }).map(({ data: { accounts } }) => {
      // set your application state
      console.log("requestData accounts: ", accounts);
    });
  },
  {
    networkId: 11, // for betanet 01 for mainnet
    onDisconnect: () => {
      // clear your application state
    },
    onInit: ({ accounts }) => {
      // set your initial application state
      console.log("onInit accounts: ", accounts);
    },
  }
);

const Button = styled.button`
  background-color: blue;
  color: white;
  font-size: 20px;
  padding: 10px 60px;
  border-radius: 5px;
  margin-top: 50vh;
  display: block;
  margin-left: auto;
  margin-right: auto;
  cursor: pointer;
`;

const ContentWrapper = styled("div")`
  position: relative;
  z-index: 1;
  width: 100vw;
  height: 100vh;
`;
export default Cognito;
