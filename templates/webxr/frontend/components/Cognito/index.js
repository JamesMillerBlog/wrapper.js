import { Auth } from 'aws-amplify';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import React, { useEffect } from 'react';
import cognitoStore from './../../stores/cognito';
import userStore from './../../stores/user';
import styled from 'styled-components';
import { setupAmplify } from './utils.js';
import { httpApiURL } from '../../utils';
import axios from 'axios';

setupAmplify();

const getUserData = (cognito) => axios({
    method: 'post',
    url: `${httpApiURL}/users/data`,
    data: {
      cognito: cognito
    },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cognito.jwt}`
    } 
}).then((res) => {
    const data = JSON.parse(res.data.body);
    return data;
}, (error) => {
    throw new Error(error);
})
    
const Cognito = (props) => {
    const { children } = props;
    const { cognito, setCognito, signInState, setSignInState } = cognitoStore();
    const { setUser } = userStore();
    const { user } = useAuthenticator((context) => [context.user]);

    useEffect(() => {
        const fetchData = async() => {
            // Update the document title using the browser API
            if(cognito != '' && cognito != undefined) {
                try{
                    setUser(await getUserData(cognito));
                } catch (e) {
                    console.log(e);
                }
            }

            if(user != undefined && cognito == '' && user.signInUserSession) {
                const {accessToken, idToken} = user.signInUserSession;
                const role = accessToken.payload['cognito:groups'];
                const token = {
                    jwt: idToken.jwtToken,
                    role: (role) ? role[0] : '',
                    username: accessToken.payload.username 
                }
                setCognito(token);
            }
        }
        
        try {
            fetchData();
        }
        catch (e) {
            console.error(e);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])
    
    useEffect(() => {
        const fetchData = async() => {
            if(signInState == 'signOut') {
                await Auth.signOut();
                setCognito('');
                setSignInState('signedOut');
            }
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signInState]);
    return (
        <>
            {cognito == '' ?
                <AmplifyWrapper>          
                    <Authenticator
                        headerText="Enter your details below"
                        submitButtonText="Sign in"
                        usernameAlias="email"
                        hideSignUp
                    >
                    </Authenticator>
                </AmplifyWrapper>

            :
                <ContentWrapper>
                    {children}
                </ContentWrapper>
            }
        </>
    )
}

const AmplifyWrapper = styled('div')`
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
`
const ContentWrapper = styled('div')`
    position: relative;
    z-index: 1;
    width: 100vw;
    height: 100vh;
`

export default Cognito;