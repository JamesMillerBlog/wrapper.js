/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: zixisun02 (https://sketchfab.com/zixisun51)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/3d-models/shiba-faef9fe5ace445e7b2989d1c1ece361c
title: Shiba
*/

import React, { useRef, forwardRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import withCollaboration from './withCollaboration';
import withXrInteractivity from './withXrInteractivity';

const Model = forwardRef((props, group) => {
  const {name } = props;
  const { nodes, materials } = useGLTF('/shiba/scene.gltf')
  return (
    <group ref={group} {...props} dispose={null} name={name}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <mesh geometry={nodes.Group18985_default_0.geometry} material={nodes.Group18985_default_0.material} />
          </group>
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <mesh geometry={nodes.Box002_default_0.geometry} material={nodes.Box002_default_0.material} />
          </group>
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <mesh geometry={nodes.Object001_default_0.geometry} material={nodes.Object001_default_0.material} />
          </group>
        </group>
      </group>
    </group>
  )
});

useGLTF.preload('/shiba/scene.gltf')


const InteractiveModel = withXrInteractivity(Model);
const Shiba = withCollaboration(InteractiveModel);

export default Shiba;