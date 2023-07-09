import React, { useState, useEffect } from "react";
import { ARButton, Controllers, VRButton, XR } from "@react-three/xr";
import deviceStore from "../../stores/device";
import Sockets from "./../Sockets";
import { Canvas } from "@react-three/fiber";
import Avatars from "./Avatars";
import KeyboardControls from "./KeyboardControls";
import Camera from "./Camera";
import socketStore from "./../../stores/socket";

export default function XRScene(props) {
  const { children } = props;
  const { device, setDevice } = deviceStore();
  const { socketUrl } = socketStore();

  useEffect(() => {
    const fetchData = async () => setDevice(await checkDevice());
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Sockets socketUrl={socketUrl}>
      {device != undefined && device == "webAR" && <ARButton />}
      {device != undefined && device == "webVR" && <VRButton />}
      <Canvas
        style={{
          height: "100vh",
          width: "100vw",
        }}
      >
        <XR referenceSpace="local">
          <Avatars />
          {device != undefined && device == "web" && (
            <>
              <KeyboardControls>
                <Camera
                  fov={65}
                  aspect={window.innerWidth / window.innerHeight}
                  radius={1000}
                />
              </KeyboardControls>
              {children}
            </>
          )}
          {device != undefined && device !== "web" && (
            <>
              <Controllers />
              <Camera
                fov={65}
                aspect={window.innerWidth / window.innerHeight}
                radius={1000}
                posCorrection={device === "webAR" ? 0 : 1.2}
              />
              {children}
            </>
          )}
        </XR>
      </Canvas>
    </Sockets>
  );
}

const checkDevice = async () => {
  if (await navigator.xr.isSessionSupported("immersive-ar")) {
    return "webAR";
  }
  if (await navigator.xr.isSessionSupported("immersive-vr")) {
    return "webVR";
  }
  return "web";
};
