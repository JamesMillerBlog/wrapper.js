import { createGlobalStyle } from 'styled-components'
import Cognito from '../components/Cognito'
import {  Authenticator } from '@aws-amplify/ui-react';

// import '@aws-amplify/ui/dist/style.css';
// import Script from 'next/script'

const GlobalStyle = createGlobalStyle`
    html {
        overflow: hidden;
    }

    *, *:before, *:after {
        box-sizing: inherit;
    }

    body{
        margin: 0;
    }

    :root {
        --amplify-primary-color:lightblue;
        --amplify-primary-tint: #0A3369;
        --amplify-primary-shade:#0A3369;
        --amplify-secondary-color:#0A3369;
        --amplify-secondary-tint:#D00C1B;
        --amplify-secondary-shade:#1F2A37;
        --amplify-tertiary-color:#5d8aff;
        --amplify-tertiary-tint:#7da1ff;
        --amplify-tertiary-shade:#537BE5;
        --amplify-grey:#828282;
        --amplify-light-grey:#c4c4c4;
        --amplify-white:#ffffff;
        --amplify-red:#dd3f5b;
        --amplify-primary-contrast: var(--amplify-white);
        --amplify-secondary-contrast:var(--amplify-white);
        --amplify-tertiary-contrast:var(--amplify-red);
        --amplify-font-family:'Helvetica Neue Light', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';  
        --amplify-text-xxs:0.75rem;
        --amplify-text-xs:0.81rem;
        --amplify-text-sm:0.875rem;
        --amplify-text-md:1rem;
        --amplify-text-lg:1.5rem;
        --amplify-text-xl:2rem;
        --amplify-text-xxl:2.5rem;
      }
    
    amplify-authenticator {
        justify-content:center;
        align-items: center;
        display: inline-block;
        height: auto;
        --width:400px;
        border: 0px solid;
        color: #0A3369;
        font-size:var(--amplify-text-md);
        --box-shadow:none; 
        --container-height:400px;
        --padding:20px;
      }
`

export default function App({ Component, pageProps }) {
    return (
        <Authenticator.Provider>
            <Cognito>  
                <GlobalStyle />
                <Component {...pageProps} />
            </Cognito>
        </Authenticator.Provider>
    )
  }
  // <Script
  //     strategy="afterInteractive"
  //     dangerouslySetInnerHTML={{
  //         __html: `
  //             (function(h,o,t,j,a,r){
  //                 h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
  //                 h._hjSettings={hjid:${process.env.hotjar_id},hjsv:6};
  //                 a=o.getElementsByTagName('head')[0];
  //                 r=o.createElement('script');r.async=1;
  //                 r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
  //                 a.appendChild(r);
  //             })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
  //         `,
  //     }}
  // />