import React, { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import Avatar from "./Avatar";
import { useController } from "@react-three/xr";

import positionsStore from "./../../../stores/positions";
import movementStore from "./../../../stores/movement";
import deviceStore from "./../../../stores/device";
import * as THREE from "three";

const ActiveUser = (props) => {
  const { image, username, userMode, avatar } = props;
  const camera = useThree((state) => state.camera);
  const from = useRef();
  const to = useRef();
  const temp = useRef();
  const userAvatar = useRef();
  const follow = useRef();
  const userCamera = useRef();
  const { device } = deviceStore();

  const { positions, setPositions } = positionsStore();
  const { movement } = movementStore();
  const coronaSafetyDistance = 3;
  const lController = useController("left");
  const rController = useController("right");
  const leftController =
    device != "web" && lController ? lController.controller : undefined;
  const rightController =
    device != "web" && rController ? rController.controller : undefined;

  let goalDistance = coronaSafetyDistance;
  let moveSpeed = 0;
  let velocity = 0;
  let dir = new THREE.Vector3();

  const [xPos, setXPos] = useState(
    userAvatar.current ? userAvatar.current.position.x : 0
  );
  const [yPos, setYPos] = useState(
    userAvatar.current ? userAvatar.current.position.y : 0
  );
  const [zPos, setZPos] = useState(
    userAvatar.current ? userAvatar.current.position.z : 0
  );

  const [leftControllerXPos, setLeftControllerXPos] = useState(0);
  const [leftControllerYPos, setLeftControllerYPos] = useState(0);
  const [leftControllerZPos, setLeftControllerZPos] = useState(0);
  const [leftControllerXRot, setLeftControllerXRot] = useState(0);
  const [leftControllerYRot, setLeftControllerYRot] = useState(0);
  const [leftControllerZRot, setLeftControllerZRot] = useState(0);

  const [rightControllerXPos, setRightControllerXPos] = useState(0);
  const [rightControllerYPos, setRightControllerYPos] = useState(0);
  const [rightControllerZPos, setRightControllerZPos] = useState(0);
  const [rightControllerXRot, setRightControllerXRot] = useState(0);
  const [rightControllerYRot, setRightControllerYRot] = useState(0);
  const [rightControllerZRot, setRightControllerZRot] = useState(0);

  // const xRotation = userAvatar.current ? userAvatar.current.rotation.x : 0;
  const [xRotation, setXRotation] = useState(
    userAvatar.current ? userAvatar.current.rotation.x : 0
  );
  const [yRotation, setYRotation] = useState(0);
  const [zRotation, setZRotation] = useState(
    userAvatar.current ? userAvatar.current.rotation.z : 0
  );

  useFrame(() => {
    if (device !== "web") {
      setYRotation(-(camera.rotation.y - 135));
      setXRotation(camera.rotation.x);
      setZRotation(-camera.rotation.z);
      setXPos(camera.position.x);
      setYPos(camera.position.y - 0.5);
      setZPos(camera.position.z);
      if (leftController) {
        setLeftControllerXPos(-leftController.position.x);
        setLeftControllerYPos(leftController.position.y);
        setLeftControllerZPos(-leftController.position.z);
        setLeftControllerXRot(-leftController.rotation.x + 0.8);
        setLeftControllerYRot(-leftController.rotation.y);
        setLeftControllerZRot(-leftController.rotation.z);
      }

      if (rightController) {
        setRightControllerXPos(-rightController.position.x);
        setRightControllerYPos(rightController.position.y);
        setRightControllerZPos(-rightController.position.z);
        setRightControllerXRot(-rightController.rotation.x + 0.8);
        setRightControllerYRot(-rightController.rotation.y);
        setRightControllerZRot(-rightController.rotation.z);
      }
    } else {
      moveSpeed = 0;
      camera.position.setFromMatrixPosition(userCamera.current.matrixWorld);

      const { forward, backward, left, right } = movement;

      if (forward && !left && !right) moveSpeed += 0.2;
      else if (forward && (left || right)) moveSpeed += 0.1;
      else if (backward && !left && !right) moveSpeed += -0.2;
      else if (backward && (left || right)) moveSpeed += -0.1;

      if (left) setYRotation(yRotation + 0.05);
      else if (right) setYRotation(yRotation - 0.05);

      velocity = (moveSpeed - velocity) * 0.3;
      userAvatar.current.translateZ(velocity);
      from.current.position.lerp(userAvatar.current.position, 0.4);
      to.current.position.copy(userCamera.current.position);
      temp.current.position.setFromMatrixPosition(camera.matrixWorld);
      dir.copy(from.current.position).sub(to.current.position).normalize();
      goalDistance += (3 - goalDistance) * 0.4;
      let dis =
        from.current.position.distanceTo(to.current.position) - goalDistance;
      userCamera.current.position.addScaledVector(dir, dis);
      temp.current.position.setFromMatrixPosition(follow.current.matrixWorld);
      userCamera.current.position.lerp(temp.current.position, 0.02);
      camera.lookAt(userAvatar.current.position);
      camera.updateProjectionMatrix();
      setXPos(userAvatar.current.position.x);
      setYPos(userAvatar.current.position.y);
      setZPos(userAvatar.current.position.z);
    }
  });

  useEffect(() => {
    const positions = {
      body: {
        position: {
          x: xPos,
          y: yPos,
          z: zPos,
        },
        rotation: {
          x: xRotation,
          y: yRotation,
          z: zRotation,
        },
      },
      leftHand: {
        position: {
          x: leftControllerXPos,
          y: leftControllerYPos,
          z: leftControllerZPos,
        },
        rotation: {
          x: leftControllerXRot,
          y: leftControllerYRot,
          z: leftControllerZRot,
        },
      },
      rightHand: {
        position: {
          x: rightControllerXPos,
          y: rightControllerYPos,
          z: rightControllerZPos,
        },
        rotation: {
          x: rightControllerXRot,
          y: rightControllerYRot,
          z: rightControllerZRot,
        },
      },
    };

    setPositions(positions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    xPos,
    yPos,
    zPos,
    xRotation,
    yRotation,
    zRotation,
    leftControllerXPos,
    leftControllerYPos,
    leftControllerZPos,
    leftControllerXRot,
    leftControllerYRot,
    leftControllerZRot,
    rightControllerXPos,
    rightControllerYPos,
    rightControllerZPos,
    rightControllerXRot,
    rightControllerYRot,
    rightControllerZRot,
  ]);

  return (
    <>
      {device === "web" && (
        <>
          <group ref={from} />
          <group ref={to} />
          <group ref={userCamera} />
          <group ref={temp} />

          <group ref={userAvatar} rotation={[0, yRotation, 0]}>
            <group ref={follow} position={[0, 1, -3]} />
          </group>
          <Avatar
            key={username}
            image={image}
            activeUser={true}
            avatar={avatar}
            userMode={userMode}
            movement={movement}
            body={positions.body}
          />
        </>
      )}
      {device !== "web" && userMode === "avatar" && (
        <Avatar
          key={username}
          activeUser={true}
          userMode={userMode}
          leftHand={leftController}
          rightHand={rightController}
          avatar={avatar}
        />
      )}
    </>
  );
};

export default ActiveUser;
