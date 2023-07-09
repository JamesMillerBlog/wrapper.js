import Head from "next/head";
import dynamic from "next/dynamic";
import React, { lazy } from "react";
import Header from "../components/Header";
import deviceStore from "./../stores/device";

const XRScene = dynamic(() => import("../components/XRScene"), { ssr: false });
const Shiba = lazy(() => import("../components/3dAssets/Shiba.js"), {
  ssr: false,
});
const Slide = lazy(() => import("../components/3dAssets/Slide.js"), {
  ssr: false,
});
const Dome = lazy(() => import("../components/3dAssets/Dome.js"), {
  ssr: false,
});
const ERC20 = lazy(() => import("../components/ERC20"), {
  ssr: false,
});

export default function Home() {
  const { device } = deviceStore();

  return (
    <>
      <Head>
        <title>Wrapper.js Eth Metaverse Example</title>
      </Head>
      <Header />
      <XRScene>
        <Shiba name={"shiba"} position={[1, -1.1, -3]} rotation={[0, 1, 0]} />
        {device != "webAR" && (
          <Dome name={"breakdown"} image={"space.jpg"} admin={true} />
        )}
        <ERC20
          position={[-1, 0, 3]}
          rotation={[0, 3, 0]}
          width={59}
          height={50}
        />
        <Slide
          name={"smile"}
          image={"smile.jpeg"}
          position={[-2, 0, -2]}
          rotation={[0, 0, 0]}
          width={1}
          height={1}
        />
        <ambientLight intensity={10} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <spotLight position={[10, 10, 10]} angle={15} penumbra={1} />
      </XRScene>
    </>
  );
}
