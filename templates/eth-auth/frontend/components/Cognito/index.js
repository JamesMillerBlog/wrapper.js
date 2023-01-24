import React, { useEffect } from "react";
import cognitoStore from "../../stores/cognito";
import styled from "styled-components";
import { checkCredentials, requestAccount, signOut } from "./utils.js";

const Cognito = (props) => {
  const { children } = props;
  const { cognito, setCognito, signInState, setSignInState } = cognitoStore();

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
