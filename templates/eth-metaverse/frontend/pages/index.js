import Head from 'next/head'
import dynamic from 'next/dynamic';
import React, { useRef, useState, Suspense, lazy, useEffect } from 'react'

import Header from '../components/Header'

const XRScene = dynamic(() => import("../components/XRScene"), { ssr: false });
const Shiba = lazy(() => import("../components/3dAssets/Shiba.js"), {ssr: false});
const Slide = lazy(() => import("../components/3dAssets/Slide.js"), {ssr: false});
const Dome = lazy(() => import("../components/3dAssets/Dome.js"), {ssr: false});

export default function Home() {
  return (
    <>
      <Head>
        <title>Wrapper.js Web XR Example</title>
      </Head>
      <Header />
      <XRScene>
        <Shiba 
          name={'shiba'}
          position={[1, -1.1, -3]}
          rotation={[0,1,0]} 
        />
        <Dome
          name={'breakdown'}
          image={'space.jpg'}
          admin={true}
        />
        <Slide 
          name={'smile'}
          image={'smile.jpeg'}
          position={[-2, 1, 0]}
          rotation={[0,-.5,0]} 
          width={10}
          height={10}
        />
        <ambientLight intensity={10} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <spotLight position={[10, 10, 10]} angle={15} penumbra={1} />
      </XRScene>
    </>
  )
}