import React, { useRef, useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber';
import { RayGrab, useXREvent } from '@react-three/xr';
import deviceStore from '../../stores/device';
import socketStore from '../../stores/socket';
import cognitoStore from '../../stores/cognito';
import selectedObjectStore from '../../stores/selectedObject';
import { Matrix4 } from 'three';

const withCollaboration = (BaseComponent) => (props) => {
  const { device } = deviceStore();
  const { selectedObject } = selectedObjectStore();
  const { sendJsonMessage, lastJsonMessage } = socketStore();
  const { cognito } = cognitoStore();
  const { scene } = useThree();  
  const [socketMode, setSocketMode] = useState('initialLoad');
  

  useEffect(()=> {
    if(device != '' && device != 'web') {
      if(selectedObject.objectname) {
        submitPositionsToCloud(selectedObject.objectname, cognito.username, scene.getObjectByName(selectedObject.objectname), sendJsonMessage);
      }
    }
  },[selectedObject])
  
  
  useEffect(()=> { 
    if(device != '') {
      updateModelFromWebSockets(lastJsonMessage, props.name, cognito, scene.getObjectByName(props.name), socketMode, setSocketMode);
    }
  }, [lastJsonMessage])

  return (
    <BaseComponent 
      {...props}
    />  
  )
};

const submitPositionsToCloud = (objectname, username, object, sendJsonMessage) => {
  let newData = {
    type: 'objects',
    uid: objectname,
    data: {
      submittedBy: username,
      matrixWorld: object.matrixWorld
    }
  };
  sendJsonMessage({
    action: 'positions',
    data: newData
  });
}

const updateModelFromWebSockets = (lastJsonMessage, name, cognito, group, socketMode, setSocketMode) => {
  let data;
  if(lastJsonMessage != null){
    for(let x=0; x<lastJsonMessage.length; x++) {
      if(lastJsonMessage[x].uid == name) {
        if(lastJsonMessage[x].data.matrixWorld.length != 0) {
          data = lastJsonMessage[x].data;
        } 
      } 
    }
  } 
  if(data) {
    if(socketMode == 'stream' && data.submittedBy != cognito.username || socketMode == 'initialLoad') {
      let tempMatrix = new Matrix4();
      tempMatrix.copy(data.matrixWorld);
      tempMatrix.decompose(group.position, group.quaternion, group.scale)
      if(socketMode == 'initialLoad') {
        setSocketMode('stream');
      }
    } 
  }
}

export default withCollaboration;

