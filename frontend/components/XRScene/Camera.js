import { useThree } from "@react-three/fiber";
import React, { useRef, useEffect } from "react";
import deviceStore from "./../../stores/device";

const Camera = (props) => {
  const ref = useRef();
  const set = useThree((state) => state.set);
  const gl = useThree((state) => state.gl);
  const { device } = deviceStore();
  let camera = useThree((state) => state.camera);
  if (device !== "web") gl.xr.setUserCamera(camera);

  useEffect(() => {
    set({
      camera: ref.current,
    });
    camera.position.set(0, 0.5, -5);
    camera.updateProjectionMatrix();
    if (device === "webAR") {
      const posCorrection = props.posCorrection ? props.posCorrection : 0;
      camera.position.y -= posCorrection;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <perspectiveCamera ref={ref} {...props} />;
};

export default Camera;
