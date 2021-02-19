
import { Math as ThreeMath } from "three";
import * as CANNON from "cannon-es";
import React, { Suspense } from "react";
import {
  Canvas,
  useLoader,
  useThree,
  useFrame,
  extend,
} from "react-three-fiber";
import { useCannon, Provider } from "./useCannon";
import { threeToCannon } from "three-to-cannon";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import "./App.css";

const { degToRad } = ThreeMath;
extend({ OrbitControls });

function Plane({ position }) {
  // Register plane as a physics body with zero mass
  const ref = useCannon({ mass: 0 }, (body) => {
    body.addShape(new CANNON.Plane());
    body.position.set(...position);
  });
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[1000, 1000]}/>
      <meshPhongMaterial attach="material" color="#272727" />
    </mesh>
  );
}

function Box({ position }) {
  // Register box as a physics body with mass
  const ref = useCannon({ mass: 10 }, (body) => {
    body.addShape(new CANNON.Box(new CANNON.Vec3(1, 1, 1)));
    body.position.set(...position);
  });
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxBufferGeometry attach="geometry" args={[2, 2, 2]} />
      <meshStandardMaterial attach="material" />
    </mesh>
  );
}

function Roulette() {
  const fbxModel = useLoader(FBXLoader, "models/roulette.fbx");
  // const shape = threeToCannon(fbxModel, { type: threeToCannon.Type.MESH });
  return (
    <primitive
      object={fbxModel}
      position={[0, 0, 0]}
      rotation={[degToRad(90), 0, 0]}
    />
  );
}

const CameraControls = () => {
  const {
    camera,
    gl: { domElement },
  } = useThree();
  
  return <orbitControls args={[camera, domElement]} />;
};

const App = () => {
  return (
    <Canvas className="main" shadowMap camera={{ position: [0, 0, 15] }}>
      <CameraControls />
      <ambientLight intensity={0.5} />
      <spotLight
        intensity={0.6}
        position={[30, 30, 50]}
        angle={0.2}
        penumbra={1}
        castShadow
      />

      <Provider>
        <Plane position={[0, 0, 0]} rotation={[12, 12, 120]} />
        <Box position={[1, 0, 1]} />
        <Box position={[2, 1, 5]} />
        <Box position={[0, 0, 6]} />
        <Box position={[-1, 1, 8]} />
        <Box position={[-2, 2, 13]} />
        <Box position={[2, -1, 13]} />
        <Suspense fallback={null}>
          <Roulette />
        </Suspense>
      </Provider>
    </Canvas>
  );
}

export default App