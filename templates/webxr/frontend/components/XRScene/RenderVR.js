import React, { useRef, useState, useEffect, Suspense, lazy } from 'react'
import { VRCanvas, ARCanvas, useXR, DefaultXRControllers, Hands } from '@react-three/xr'
import Camera from './Camera';
import Avatars from './Avatars';

const RenderVR = (props) => {
    const { player } = useXR()
    const { children } = props;
    useEffect(()=> {
        if(player) {
            player.position.y -= 8;
        }
    })
    return (
        <VRCanvas style={{
            height: '100vh',
            width: '100vw'
        }}>
            <Suspense fallback={null}>
                <Avatars/>
                <Camera 
                    fov={65}
                    aspect={window.innerWidth / window.innerHeight}
                    radius={1000}
                    posCorrection={1.2} 
                />
                <DefaultXRControllers />
                <Hands />
                {children}
            </Suspense>
        </VRCanvas>
    )
  }

export default RenderVR;