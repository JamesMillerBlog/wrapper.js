import { XR } from "@react-three/xr";
import { useFrame } from "@react-three/fiber";
import framesStore from "../../stores/frames";

const Scene = (props) => {
  const { frames, setFrames } = framesStore();

  useFrame(() => {
    setFrames(frames + 1);
  });
  return <XR referenceSpace="local">{props.children}</XR>;
};

export default Scene;
