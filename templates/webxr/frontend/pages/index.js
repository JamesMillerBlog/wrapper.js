import Head from "next/head";
import dynamic from "next/dynamic";
import React, { lazy } from "react";
import deviceStore from "./../stores/device";
import avatarStore from "./../stores/avatar";
import Header from "../components/Header";
import RpmPopUp from "../components/ReadyPlayerMe";

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

export default function Home() {
  const { device } = deviceStore();
  const { showIFrame } = avatarStore();
  return (
    <>
      <Head>
        <title>Wrapper.js Web XR Example</title>
      </Head>
      <Header />
      {showIFrame && <RpmPopUp />}
      <XRScene>
        <Shiba name={"shiba"} position={[1, 0, -3]} rotation={[0, 1, 0]} />
        {device != "webAR" && (
          <Dome name={"breakdown"} image={"space.jpg"} admin={true} />
        )}
        <Slide
          name={"smile"}
          image={"smile.jpeg"}
          position={[-2, 0, -2]}
          rotation={[0, 0, 0]}
          width={1}
          height={1}
        />
        <ambientLight intensity={1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <spotLight position={[10, 10, 10]} angle={15} penumbra={1} />
      </XRScene>
    </>
  );
}
