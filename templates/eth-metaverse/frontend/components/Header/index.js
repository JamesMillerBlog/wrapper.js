import React, { useState, useEffect } from 'react';
import styled, { StyledComponent } from 'styled-components';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import Link from 'next/link'
import cognitoStore from './../../stores/cognito'
import userStore from './../../stores/user'
import { useRouter } from 'next/router';
import { imageUrl } from '../../utils'

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
    background-color: #102B4E;
    margin: 0;
    position: relative;
    top: 0px;
    padding-top: 0px;
    font-family: Ford Antenna;
    z-index: 1;
`

const SignoutBtn = styled('button')`
    font-size: 16px;
    text-decoration: none;
    &:hover {
        background: none;
    }
    cursor: pointer;
    color: white;
`;