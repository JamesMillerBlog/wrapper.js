import React, { useRef, useState, useEffect, Suspense, lazy } from 'react'
import { VRCanvas, ARCanvas, useXR, DefaultXRControllers, Hands } from '@react-three/xr'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import cognitoStore from '../../stores/cognito';
import * as THREE from "three";
// import VADR from 'vadr-three-vr';
// const vadr =  lazy(() => import('vadr-three-vr'), {ssr:false});

export default function Analytics(props) {
  const { children } = props;
  const { camera, scene, gl } = useThree();
  const { cognito } = cognitoStore();
  let appDetails = {
    appId: process.env.vadr_app_id,
    appToken: process.env.vadr_app_token,
    sceneId: process.env.vadr_scene_id,
    version: '1.0.0',
    testMode: true    
  }
//   console.log(vadr);
  let appParams = {
    'defaultEvents': [
        {
            'name': 'orientation',
            'status': true,
            'timePeriod': 300
        },
        {
            'name': 'gaze',
            'status': true,
            'timePeriod': 300
        },
        {
            'name': 'performance',
            'status': true,
            'timePeriod': 300
        }
    ],
    'sessionInfo': [
        {
            'key': 'demo place',
            'value': 'Virtual Meeting Development'
        }
    ],
    'pauseOnHeadsetRemove': true, // to pause the data collection when headset is removed,
    'ignoreWindowStateChange': true // when user wishes to manage the state of the window to play or pause data collection
  }

  useEffect(() => {
      window.THREE = THREE;
      const scriptUrls = ["https://vadr.azureedge.net/sdk/js/vadr-three.js", "https://vadr.azureedge.net/sdk/js/Image360Extractor.js"]
      const scripts = []
      for(let x=0; x < scriptUrls.length; x++) {
        scripts[x] = document.createElement("script");
        scripts[x].src = scriptUrls[x];
        scripts[x].async = true;
        document.body.appendChild(scripts[x])
        console.log(scripts[x])
      }

      // scene.background= new THREE.Color('#fff');
      
      if(isMyScriptLoaded(scripts[scripts.length-1].src)){
        setTimeout(()=>{
          loadAnalytics(appDetails, appParams, scene, camera, cognito);
        }, 1000)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    // var generator = new THREE.CubemapGenerator( gl );
    // var renderTarget = generator.fromEquirectangular( texture, { resolution: 256 } ); // the resolution depends on your image
    
    useFrame(()=>{
      let VADR = window.VADR;
        if(VADR) VADR.tick();
    });
    
    return (
        <>
      {children}
    </>
  )
}

const loadAnalytics = async(appDetails, appParams, scene, camera, cognito) => {
    let VADR = window.VADR;
    if(VADR) {
      VADR.init(appDetails, appParams, camera, scene);
      VADR.user.setUserId(cognito.username);
    }
}

const isMyScriptLoaded = (url) => {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length; i--;) {
        if (scripts[i].src == url) return true;
    }
    return false;
}
