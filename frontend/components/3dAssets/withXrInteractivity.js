import React, { useRef, useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber';
import { RayGrab, useXREvent } from '@react-three/xr';
import deviceStore from '../../stores/device';

import selectedObjectStore from '../../stores/selectedObject';
import { Matrix4, Vector3, } from 'three';

const withXrInteractivity = (BaseComponent) => (props) => {
  const { device } = deviceStore();
  const { setSelectedObject } = selectedObjectStore();
  const group = useRef();
  const { scene } = useThree();  
  const [oldPosition, setOldPosition] = useState();
  const [newPosition, setNewPosition] = useState()
  
  
  if(device != '' && device != 'web') {
    useXREvent('selectstart', (e) => {
      updatePosition(props.name, scene, setOldPosition);
    });
    
    useXREvent('selectend', (e) => {
      updatePosition(props.name, scene, setNewPosition);
    })
  } 

  useEffect(()=> {
    if(oldPosition && newPosition) {
      // if the old positions are not equal to the new positions
      if(oldPosition.x != newPosition.x || oldPosition.y != newPosition.y || oldPosition.z != newPosition.z) {
        // then you know this object has just been updated, execute logic to update websockets and analytics
        selectedObject(props.name, scene.getObjectByName(props.name), setSelectedObject, group);
      }
    }
  },[oldPosition, newPosition])

  return (
    <>
        {device != '' && device != 'web' && 
          <RayGrab>
              <BaseComponent 
                ref={group} 
                {...props} 
              />
          </RayGrab>
        }
        {device != '' && device == 'web' && 
          <BaseComponent 
          ref={group}
          {...props}
          />
        }
    </>
  )
};

const updatePosition = (name, scene, setPosition) => {
  let pos = new Vector3();
  let tempMatrix = new Matrix4;
  tempMatrix = scene.getObjectByName(name).matrixWorld;

  // set the oldPosition based on the matrix world positions
  pos.setFromMatrixPosition(tempMatrix);
  setPosition(pos)
};

const selectedObject = (objectname, object, setSelectedObject, group) => {
  let { x, y, z } = object.position
  setSelectedObject({
    objectname: objectname,
    position: {
      x:x, 
      y:y, 
      z:z
    }, 
    group: group
  });
}

export default withXrInteractivity;

