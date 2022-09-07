import * as THREE from "three";

import { useFrame, useThree, extend } from '@react-three/fiber';
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useXR, useXRFrame } from '@react-three/xr'
import cognitoStore from './../../stores/cognito';
import socketStore from './../../stores/socket';

const Camera = (props) => {
    const ref = useRef();
    const set = useThree((state) => state.set);
    const { player } = useXR()
    const [xPos, setXPos] = useState([]);
    const [yPos, setYPos] = useState([]);
    const [zPos, setZPos] = useState([]);

    const [xRotation, setXRotation] = useState([]);
    const [yRotation, setYRotation] = useState([]);
    const [zRotation, setZRotation] = useState([]);
    const [movement, setMovement] = useState(false);
    const [trigger, setTrigger] = useState(false);
    const [user, setUser] = useState([]);
    const camera = useThree((state) => state.camera)
    const { cognito } = cognitoStore();
    const { sendJsonMessage } = socketStore();
    const posCorrection = (props.posCorrection) ? props.posCorrection : 0;
    const positionVariables = {
        setXPos, setYPos, setZPos,
        setXRotation, setYRotation, setZRotation,
        camera
    }

    useEffect(() => {
        const updatedPositions = {xPos, yPos, zPos, xRotation, yRotation, zRotation};
        updateGlobalPositions(updatedPositions, setMovement, setUser);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [xPos, yPos, zPos, xRotation, yRotation, zRotation])

    useFrame(() => updatePositions(positionVariables));
    useXRFrame(() => updatePositions(positionVariables));
    

    useEffect(() => {
        set({ 
            camera: ref.current,
        })
        ref.current.position.set(0, .5, -5);
        ref.current.lookAt(new THREE.Vector3(0, .5, 0));
        ref.current.updateProjectionMatrix()

        setInterval(()=>{
          setTrigger(true);
        }, 250);
    
        if(player) {
          player.position.y -= posCorrection;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
    
      useEffect(() => {
        const { username } = cognito;
        let newData ={
          type: 'users',
          uid: username,
          data: user
        };
        if(trigger){
          if(movement == true) {
            setMovement(false);
          } else {
            newData.data = '';
          }
          sendJsonMessage({
            action: 'positions',
            data: newData
          });
        }
        setTrigger(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trigger]);
    
    
    return (
        <perspectiveCamera ref={ref} {...props}/>
    ) 
}
    
    
const updatePositions = (positionVariables) => {
    const {
        setXPos, setYPos, setZPos,
        setXRotation, setYRotation, setZRotation, 
        camera
    } = positionVariables;
    
    setXPos(camera.position.x)
    setYPos(camera.position.y)
    setZPos(camera.position.z)
    setXRotation(camera.rotation.x)
    setYRotation(camera.rotation.y)
    setZRotation(camera.rotation.z)
}
const updateGlobalPositions = (updatedPositions, setMovement, setUser) => {
    setMovement(true);
    const { xPos, yPos, zPos, xRotation, yRotation, zRotation } = updatedPositions;
    let position = {
        x: xPos,
        y: yPos,
        z: zPos
    };
    
    let rotation = {
        x: xRotation,
        y: yRotation,
        z: zRotation
    }
    let newUserData = {
        position: position,
        rotation: rotation
    };
    // console.log(newUserData)
    setUser(newUserData);
}
export default Camera;