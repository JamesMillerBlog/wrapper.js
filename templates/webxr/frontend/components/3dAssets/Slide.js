import React, { useRef, forwardRef, useState, useEffect, Suspense, lazy } from 'react'
import { useLoader, useFrame, useThree } from '@react-three/fiber'
import * as THREE from "three";
import withCollaboration from './withCollaboration';
import withXrInteractivity from './withXrInteractivity';

const Model = forwardRef((props, group) => {
  const { image, name, width, height } = props;
  const { gl } = useThree();
  const texture = useLoader(THREE.TextureLoader, `/images/${image}`)
  texture.anisotropy = gl.capabilities.getMaxAnisotropy();
  
  return (
        <mesh ref={group} name={name}>
          <planeBufferGeometry attach="geometry" args={[width, height]} />
          <meshBasicMaterial attach="material" map={texture} />
        </mesh>
  )
})

const InteractiveModel = withXrInteractivity(Model);
const Slide = withCollaboration(InteractiveModel);

export default Slide;
