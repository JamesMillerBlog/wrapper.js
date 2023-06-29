import React from "react";
import styled from "styled-components";
import cognitoStore from "./../../stores/cognito";
import avatarStore from "./../../stores/avatar";

export default function Header() {
  const { setCognito, setSignInState } = cognitoStore();
  const { showIFrame, setShowIFrame, setUserMode } = avatarStore();
  return (
    <Nav>
      <AvatarToggleBtn
        className="toggleButton"
        onClick={() => setShowIFrame(!showIFrame)}
        type="button"
      >
        {`${showIFrame ? "Close Configurator" : "Configure Avatar"}`}
      </AvatarToggleBtn>
      {showIFrame && (
        <SelectImageBtn
          onClick={() => {
            setUserMode("image");
            setShowIFrame(false);
          }}
        >
          Select Image
        </SelectImageBtn>
      )}
      <SignoutBtn onClick={() => signout(setCognito, setSignInState)}>
        Log out
      </SignoutBtn>
    </Nav>
  );
}

const signout = (setCognito, setSignInState) => {
  setCognito("");
  setSignInState("signOut");
};

const Nav = styled("nav")`
  display: block;
  height: 80px;
  width: 100vw;
  background-color: #102b4e;
  margin: 0;
  position: relative;
  top: 0px;
  padding-top: 0px;
  z-index: 1;
`;

const SignoutBtn = styled("button")`
  font-size: 16px;
  text-decoration: none;
  &:hover {
    background: none;
  }
  cursor: pointer;
  color: white;
  background-color: grey;
  float: right;
`;

const AvatarToggleBtn = styled("button")`
  font-size: 16px;
  text-decoration: none;
  &:hover {
    background: none;
  }
  cursor: pointer;
  color: white;
  background-color: grey;
  float: left;
`;

const SelectImageBtn = styled("button")`
  font-size: 16px;
  text-decoration: none;
  &:hover {
    background: darkred;
  }
  cursor: pointer;
  color: white;
  background-color: red;
  float: left;
`;
