import React, { useRef, useState, useEffect, Suspense, lazy } from 'react'
import RenderWeb from './RenderWeb';
import RenderAR from './RenderAR';
import RenderVR from './RenderVR';
import deviceStore from '../../stores/device';
import Sockets from './../Sockets';

export default function XRScene(props) {
  const { children } = props;
  const { device, setDevice } = deviceStore();
  useEffect(() => {
    const fetchData = async() => setDevice(await checkDevice())
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Sockets>
      {device != undefined && device == 'webAR' &&  
        <RenderAR>
          {children}
        </RenderAR>
      }
      {device != undefined && device == 'webVR' &&  
        <RenderVR>
          {children}
        </RenderVR>
      }
      {device != undefined && device == 'web' &&  
        <RenderWeb>
          {children}
        </RenderWeb>
      }
    </Sockets>
  )
}

const checkDevice = async() => {
  if(navigator.xr == undefined) return 'web'
  let isAR = await navigator.xr.isSessionSupported( 'immersive-ar');
  if(isAR) return 'webAR';
  let isVR = await navigator.xr.isSessionSupported( 'immersive-vr');
  if(isVR) return 'webVR';
  return 'web'
}