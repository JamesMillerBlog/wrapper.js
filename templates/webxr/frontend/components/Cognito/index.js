import { Auth } from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignIn } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import React, { useEffect } from 'react';
import cognitoStore from './../../stores/cognito';
import userStore from './../../stores/user';
import styled from 'styled-components';
import { setupAmplify } from './utils.js';
import { httpApiURL } from '../../utils';
import axios from 'axios';

setupAmplify();

const getBearerToken = async () => {
    try {
        const token = await Auth.currentAuthenticatedUser();
        const data = {
            jwt: token.signInUserSession.idToken.jwtToken,
            role: token.signInUserSession.accessToken.payload['cognito:groups'][0],
            username: token.username 
        }
        return data;
    }
    catch (error) {
        // console.log(error);
    }
    return {
        jwt: null,
        role: null,
        username: null
    }
}
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
    console.log(error);
})
    
const Cognito = (props) => {
    const { children } = props;
    const { cognito, setCognito, signInState, setSignInState } = cognitoStore();
    const { setUser } = userStore();

    useEffect(() => {
        const fetchData = async() => {
            // Update the document title using the browser API
            if(cognito != '' && cognito != undefined) {
                // newUser.push(await getUserData(cognito))
                // setUser(newUser);
                setUser(await getUserData(cognito));
            }
            return onAuthUIStateChange( async(nextAuthState, authData) => {
                if(authData != undefined && cognito == '' && nextAuthState == 'signedin') {
                    let token = await getBearerToken();
                    setCognito(token);
                }
            });
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cognito])
    
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
        {cognito == '' &&
            <AmplifyWrapper>          
                <AmplifyAuthenticator>
                    <AmplifySignIn 
                        slot="sign-in" 
                        headerText="Enter your details below"
                        submitButtonText="Sign in"
                        usernameAlias="email"
                        hideSignUp
                    />
                </AmplifyAuthenticator>
            </AmplifyWrapper>

        }
        {cognito != '' &&
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


