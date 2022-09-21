import React from 'react';
import styled from 'styled-components';
import cognitoStore from './../../stores/cognito'

export default function Header() {
    const { setCognito, setSignInState } = cognitoStore();
    
    return (
        <Nav>
            <SignoutBtn onClick={() => signout(setCognito, setSignInState)}>
                Log out
            </SignoutBtn>
        </Nav>  
    )
};

const signout = (setCognito, setSignInState) => {
    setCognito('');
    setSignInState('signOut')
}


const Nav = styled('nav')`
    display: block;
    height: 80px;
    width: 100vw;
    background-color: lightblue;
    margin: 0;
    position: relative;
    top: 0px;
    padding-top: 0px;
    z-index: 1;
`

const SignoutBtn = styled('button')`
    font-size: 16px;
    text-decoration: none;
    &:hover {
        background: darkblue;
    }
    cursor: pointer;
    color: white;
    background-color: blue;
    height: 100%;
    border: 0;
    padding: 0;
    width: 100px
`;