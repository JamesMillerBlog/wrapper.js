import Head from "next/head";
import React, { useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

import { httpApiURL } from "./../utils";
import Header from "../components/Header";
import cognitoStore from "../stores/cognito";

export default function Home() {
  const { cognito } = cognitoStore();

  useEffect(() => {
    const getData = async (cognito) =>
      await axios({
        method: "get",
        url: `${httpApiURL}/users/data`,
        data: {
          cognito: cognito,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cognito.jwt}`,
        },
      }).then(
        (res) => {
          console.log(res.data.body);
        },
        (error) => {
          console.log(error);
        }
      );

    getData(cognito);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>Wrapper.js Authentication Example</title>
      </Head>
      <Header />

      <Img src="/wrapperjs.png" />
      <P>Authentication template</P>
    </>
  );
}

const Img = styled("img")`
  display: block;
  height: 60vh;
  width: auto;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  // min-width: 500px;
`;

const P = styled("p")`
  text-align: center;
  font-weight: bold;
`;
