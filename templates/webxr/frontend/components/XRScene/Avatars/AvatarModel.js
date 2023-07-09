import React, { useRef, useEffect } from "react";
import { useAnimations } from "@react-three/drei";
import deviceStore from "../../../stores/device";

const AvatarModel = (props) => {
  const { device } = deviceStore();

  const group = useRef();
  const { actions, mixer } = useAnimations(props.animations, group);
  const paused = actions["jump"] !== undefined ? actions["jump"].paused : true;
  if (device !== "webVR") props.body.position.y = -1.2;

  useEffect(() => {
    if (props.movement && props.movement.jump) {
      if (paused) actions["jump"].stop();
      actions["jump"].play();
      actions["jump"].clampWhenFinished = true;
      actions["jump"].repetitions = 0;
    }
    if (props.movement.forward === true) {
      if (paused) actions["jump"].stop();
      actions["idle"].stop();
      actions["run"].play();
    } else if (props.movement.forward === false) {
      actions["run"].stop();
      actions["idle"].play();
    }
  }, [mixer, props.movement, paused, device]);

  return (
    <primitive
      object={props.model}
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

export default AvatarModel;
