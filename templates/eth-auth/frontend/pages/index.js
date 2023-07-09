import Head from "next/head";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import ERC20 from "../components/ERC20";

import cognitoStore from "../stores/cognito";
import { getData } from "../components/Cognito/utils";

export default function Home() {
  const { cognito } = cognitoStore();
  const [data, setData] = useState("");

  useEffect(() => {
    if (cognito) {
      (async () => {
        const data = await getData(cognito);
        setData(data);
      })();
    }
  }, []);
  return (
    <>
      <Head>
        <title>Wrapper.js Web3 Authentication Example</title>
      </Head>
      <Header />
      <ERC20 />
      <Img src="/wrapperjs.png" />
      <P>Web3 Authentication template</P>
      <Code>{data}</Code>
    </>
  );
}

const Img = styled("img")`
  display: block;
  height: 40vh;
  width: auto;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  // min-width: 500px;
`;

const Code = styled("code")`
  text-align: center;
  display: block;
  width: 60%;
  margin-left: auto;
  margin-right: auto;
`;

const P = styled("p")`
  text-align: center;
  font-weight: bold;
`;
