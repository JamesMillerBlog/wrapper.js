import React, { useRef } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Avatar = (props) => {
  const { position, rotation, image } = props;
  const avatarMesh = useRef();
  let setImage;
  if (image == undefined) setImage = "jamesmiller.png";
  else setImage = image;
  const texture = useLoader(THREE.TextureLoader, `/images/${setImage}`);

  useFrame(() => {
    if (
      avatarMesh != undefined &&
      rotation != undefined &&
      position != undefined
    ) {
      avatarMesh.current.rotation.y = -rotation.y;
      avatarMesh.current.position.x = position.x;
      avatarMesh.current.position.y = position.y;
      avatarMesh.current.position.z = position.z;
    }
  });

  return (
    <mesh ref={avatarMesh}>
      <planeGeometry attach="geometry" args={[0.5, 0.5]} />
      <meshBasicMaterial
        attach="material"
        side={THREE.DoubleSide}
        map={texture}
      />
    </mesh>
  );
};
export default Avatar;
