import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useRef, useEffect, useState } from "react";
import userStore from "./../../stores/user";
import socketStore from "./../../stores/socket";
import deviceStore from "../../stores/device";

const Camera = (props) => {
  const ref = useRef();
  const set = useThree((state) => state.set);
  const [xPos, setXPos] = useState([]);
  const [yPos, setYPos] = useState([]);
  const [zPos, setZPos] = useState([]);
  const { device } = deviceStore();

  const [xRotation, setXRotation] = useState([]);
  const [yRotation, setYRotation] = useState([]);
  const [zRotation, setZRotation] = useState([]);
  const [movement, setMovement] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [userData, setUserData] = useState([]);
  const camera = useThree((state) => state.camera);
  const { user } = userStore();
  const { sendJsonMessage } = socketStore();
  const positionVariables = {
    setXPos,
    setYPos,
    setZPos,
    setXRotation,
    setYRotation,
    setZRotation,
    camera,
  };

  useEffect(() => {
    const updatedPositions = {
      xPos,
      yPos,
      zPos,
      xRotation,
      yRotation,
      zRotation,
    };
    updateGlobalPositions(updatedPositions, setMovement, setUserData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xPos, yPos, zPos, xRotation, yRotation, zRotation]);

  useFrame(() => updatePositions(positionVariables));

  useEffect(() => {
    set({
      camera: ref.current,
    });
    ref.current.position.set(0, 0.5, -5);
    ref.current.lookAt(new THREE.Vector3(0, 0.5, 0));
    ref.current.updateProjectionMatrix();

    setInterval(() => {
      setTrigger(true);
    }, 250);

    if (device === "webVR") {
      const posCorrection = props.posCorrection ? props.posCorrection : 0;
      camera.position.y -= posCorrection;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let newData = {
      type: "users",
      uid: user,
      data: userData,
    };
    if (trigger) {
      if (movement == true) {
        setMovement(false);
      } else {
        newData.data = "";
      }

      sendJsonMessage({
        action: "positions",
        data: newData,
      });
    }
    setTrigger(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return <perspectiveCamera ref={ref} {...props} />;
};

const updatePositions = (positionVariables) => {
  const {
    setXPos,
    setYPos,
    setZPos,
    setXRotation,
    setYRotation,
    setZRotation,
    camera,
  } = positionVariables;
  setXPos(camera.position.x);
  setYPos(camera.position.y);
  setZPos(camera.position.z);
  setXRotation(camera.rotation.x);
  setYRotation(camera.rotation.y);
  setZRotation(camera.rotation.z);
};
const updateGlobalPositions = (updatedPositions, setMovement, setUserData) => {
  setMovement(true);
  const { xPos, yPos, zPos, xRotation, yRotation, zRotation } =
    updatedPositions;
  let position = {
    x: xPos,
    y: yPos,
    z: zPos,
  };

  let rotation = {
    x: xRotation,
    y: yRotation,
    z: zRotation,
  };
  let newUserData = {
    position: position,
    rotation: rotation,
  };
  setUserData(newUserData);
};
export default Camera;
