import { useRef } from "react";
import { extend, useThree, useFrame } from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

extend({ OrbitControls });

const CameraControls = () => {
  const ref = useRef();
  const {
    camera,
    gl: { domElement },
  } = useThree();

  useFrame(() => ref.current.update());

  return (
    <orbitControls
      ref={ref}
      args={[camera, domElement]}
      enableDamping
      dampingFactor={0.2}
    />
  );
};

export default CameraControls;
