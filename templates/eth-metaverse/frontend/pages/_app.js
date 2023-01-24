import { createGlobalStyle } from "styled-components";
import Cognito from "../components/Cognito";

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
`;

export default function App({ Component, pageProps }) {
  return (
    <Cognito>
      <GlobalStyle />
      <Component {...pageProps} />
    </Cognito>
  );
}
