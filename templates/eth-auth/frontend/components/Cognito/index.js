import { Auth } from "aws-amplify";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import React, { useEffect } from "react";
import cognitoStore from "../../stores/cognito";
import userStore from "../../stores/user";
import styled from "styled-components";
import { setupAmplify } from "./utils.js";
import { httpApiURL } from "../../utils";
import axios from "axios";
import { getData } from "./utils";

import { checkCredentials, requestAccount, signOut } from "./utils.js";

setupAmplify();

// const getUserData = (cognito) =>
//   axios({
//     method: "post",
//     url: `${httpApiURL}/users/data`,
//     data: {
//       cognito: cognito,
//     },
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${cognito.jwt}`,
//     },
//   }).then(
//     (res) => {
//       const data = JSON.parse(res.data.body);
//       return data;
//     },
//     (error) => {
//       throw new Error(error);
//     }
//   );

const Cognito = (props) => {
  const { children } = props;
  const { cognito, setCognito, signInState, setSignInState } = cognitoStore();
  // const { setUser } = userStore();
  // const { user } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    checkCredentials(setCognito, setSignInState);
  }, []);

  useEffect(() => {
    if (signInState == "signOut") {
      signOut(setCognito, setSignInState);
    }
  }, [signInState]);

  return (
    <ContentWrapper>
      {cognito == "" && (
        <Button onClick={() => requestAccount(setCognito, setSignInState)}>
          Sign in
        </Button>
      )}
      {cognito != "" && <>{children}</>}
    </ContentWrapper>
  );
};

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
