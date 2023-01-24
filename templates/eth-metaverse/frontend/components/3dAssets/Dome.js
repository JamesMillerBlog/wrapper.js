import React, {
  useRef,
  forwardRef,
  useState,
  useEffect,
  Suspense,
  lazy,
} from "react";
import { useLoader, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import withCollaboration from "./withCollaboration";

const Model = forwardRef((props, group) => {
  const { image, name } = props;
  const texture = useLoader(THREE.TextureLoader, `/images/${image}`);
  const { gl } = useThree();
  texture.anisotropy = gl.capabilities.getMaxAnisotropy();

  return (
    <mesh ref={group} name={name}>
      <sphereGeometry attach="geometry" args={[6, 32, 32]} />
      <meshBasicMaterial
        attach="material"
        map={texture}
        side={THREE.DoubleSide}
        color={"white"}
      />
    </mesh>
  );
});
const Dome = withCollaboration(Model);

export default Dome;
