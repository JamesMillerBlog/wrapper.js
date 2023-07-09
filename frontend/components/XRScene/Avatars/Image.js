import React, { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

const AvatarImage = (props) => {
  const avatarMesh = useRef();
  let avatarImage = props.image === undefined ? "jamesmiller.png" : props.image;
  const texture = useLoader(THREE.TextureLoader, `/images/${avatarImage}`);

  return (
    <mesh ref={avatarMesh} {...props}>
      <planeGeometry attach="geometry" args={[0.5, 0.5]} />
      <meshBasicMaterial
        attach="material"
        side={THREE.DoubleSide}
        map={texture}
      />
    </mesh>
  );
};

export default AvatarImage;
