import CognitoEth from '../components/CognitoEth'
import Header from '../components/Header'
import ERC20 from '../components/ERC20'
import React, { useState, useEffect } from 'react';
import cognitoStore from './../stores/cognito';

import mixpanel from 'mixpanel-browser';
import { getData } from './../components/CognitoEth/utils';


export default function Home() {
    mixpanel.init(process.env.mixpanel_project_token, {debug: true}); 
    mixpanel.track("DAO Page View")
    const { cognito, setCognito, signInState, setSignInState } = cognitoStore();
    const [data, setData] = useState('');

    useEffect(async() => {
      if(signInState == 'signedIn') {
        setData(await getData(cognito));
      }
    }, [signInState]);
    
    useEffect(() => {
      console.log(data)
    }, [data]);

    return (
        <CognitoEth> 
          <Header />
          <ERC20 />
          <br/>
          {data}
        </CognitoEth>
    )
};