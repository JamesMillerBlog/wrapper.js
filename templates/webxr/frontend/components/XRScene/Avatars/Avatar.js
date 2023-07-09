import React from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import AvatarModel from "./AvatarModel";
import AvatarImage from "./Image";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { useFBX } from "@react-three/drei";
import VRAvatarModel from "./VRAvatarModel";
const defaultPosition = {
  position: new THREE.Vector3(0, 0, 0),
  rotation: new THREE.Vector3(0, 0, 0),
};

const Avatar = (props) => {
  const body = props.body ? props.body : defaultPosition;
  const leftHand = props.leftHand ? props.leftHand : defaultPosition;
  const rightHand = props.rightHand ? props.rightHand : defaultPosition;

  if (props.userMode === "image") {
    return (
      <AvatarImage
        position={[body.position.x, 0, body.position.z]}
        rotation={[body.rotation.x, body.rotation.y, body.rotation.z]}
        image={props.image}
      />
    );
  } else if (props.userMode === "avatar" && props.avatar) {
    const gltf = LoadModel(props.avatar);
    const model = gltf.nodes.AvatarRoot ? gltf.nodes : gltf.scene;
    const animations = loadAnimations(["idle", "run", "jump"]);

    if (props.movement && !gltf.nodes.AvatarRoot) {
      return (
        <AvatarModel
          model={model}
          animations={animations}
          body={body}
          movement={props.movement}
        />
      );
    } else if (gltf.nodes.AvatarRoot && !props.activeUser) {
      return (
        <VRAvatarModel
          model={model}
          body={body}
          leftHand={leftHand}
          rightHand={rightHand}
        />
      );
    }
  }
};

const LoadModel = (avatar) => {
  const { nodes, scene } = useLoader(GLTFLoader, avatar, (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);
  });
  return { nodes, scene };
};

const loadAnimations = (animationArray) => {
  const clips = animationArray.map((animation) => {
    useFBX.preload(`./${animation}.fbx`);
    const { animations } = useLoader(FBXLoader, `./${animation}.fbx`);
    animations[0].name = animation;
    return animations[0];
  });
  return clips;
};

export default Avatar;
