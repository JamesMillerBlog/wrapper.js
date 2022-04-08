import React, { useRef, useState, useEffect, Suspense, lazy } from 'react'
import { VRCanvas, ARCanvas, useXR, DefaultXRControllers, Hands } from '@react-three/xr'
import Camera from './Camera';
import Avatars from '../Avatars';
import Analytics from '../Analytics';
const RenderAR = (props) => {
    const { children } = props;
    return (
        <ARCanvas style={{
          height: '100vh',
          width: '100vw'
        }}>
          <Analytics>
            <Suspense fallback={null}>
              <Avatars/>
              <Camera 
                fov={65}
                aspect={window.innerWidth / window.innerHeight}
                radius={1000} 
              />
              <DefaultXRControllers />
              {children}
            </Suspense>
          </Analytics>
        </ARCanvas>
      )
  }

export default RenderAR;