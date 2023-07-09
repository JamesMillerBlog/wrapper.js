import React, { useRef } from "react";

const VRAvatarModel = (props) => {
  const { AvatarRoot, LeftHand, RightHand } = props.model;
  if (props.leftHand && LeftHand) setHandPosition(LeftHand, props.leftHand);
  if (props.rightHand && RightHand) setHandPosition(RightHand, props.rightHand);

  const group = useRef();

  return (
    <primitive
      object={AvatarRoot}
      position={[
        props.body.position.x,
        props.body.position.y,
        props.body.position.z,
      ]}
      rotation={[
        props.body.rotation.x,
        props.body.rotation.y,
        props.body.rotation.z,
      ]}
      ref={group}
    />
  );
};

const setHandPosition = (hand, { position, rotation }) => {
  hand.position.x = position.x;
  hand.position.y = position.y;
  hand.position.z = position.z;
  hand.rotation.x = rotation.x;
  hand.rotation.y = rotation.y;
  hand.rotation.z = rotation.z;
};

export default VRAvatarModel;
