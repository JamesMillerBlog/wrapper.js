import React, { useEffect } from "react";
import socketStore from "../../stores/socket";
import cognitoStore from "../../stores/cognito";
import userStore from "../../stores/user";
import styled from "styled-components";
import { checkCredentials, requestAccount, signOut } from "./utils.js";

const Cognito = (props) => {
  const { children } = props;
  const { cognito, setCognito, signInState, setSignInState } = cognitoStore();
  const { setUser, user } = userStore();
  const { setSocketUrl } = socketStore();

  useEffect(() => {
    checkCredentials(setCognito, setUser, setSignInState);
    if (signInState == "signOut") {
      signOut(setCognito, setSignInState, setUser);
    }
  }, [signInState]);

  return (
    <ContentWrapper>
      {cognito == "" && (
        <Button
          onClick={() =>
            requestAccount(setCognito, setSignInState, setSocketUrl)
          }
        >
          Sign in
        </Button>
      )}
      {cognito != "" && user != "" && <>{children}</>}
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
