import React, { useRef, useState, useEffect, Suspense, lazy } from 'react'
import { Canvas } from '@react-three/fiber'
import Camera from './Camera';
import Avatars from '../Avatars';
import KeyboardControls from './KeyboardControls';

const RenderWeb = (props) => {
    const { children } = props;
    return (
      <Canvas style={{
        height: '100vh',
        width: '100vw'
      }}>
        <Suspense fallback={null}>
          <Avatars/>
          <KeyboardControls>
            <Camera 
              fov={65}
              aspect={window.innerWidth / window.innerHeight}
              radius={1000} 
              />
          </KeyboardControls>
          {children}
        </Suspense>
      </Canvas>
    )
  }

export default RenderWeb;