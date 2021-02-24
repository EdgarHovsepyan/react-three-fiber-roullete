import React, { Suspense } from "react";
import { PCFSoftShadowMap, ACESFilmicToneMapping } from "three";
import { Canvas } from "react-three-fiber";
import { Physics } from "./helpers/useCannon";
import Ground from "./components/Ground";
import Roulette from "./components/Roulette";

import CameraControls from "./components/OrbitControls/";
import Camera from "./components/PerspectiveCamera/";

import "./App.css";

const App = () => {
  return (
    <Canvas
      pixelRatio={window.devicePixelRatio}
      className="main"
      shadowMap
      concurrent
      colorManagement
      onCreated={({ gl }) => {
        gl.setClearColor("#120000");
        gl.shadowMap.type = PCFSoftShadowMap;
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.8;
      }}
    >
      <Camera
        position={[0, -10, 15]}
        aspect={window.innerWidth / window.innerHeight}
      />
      <CameraControls />
      <ambientLight intensity={0.5} />
      <spotLight
        intensity={0.6}
        position={[30, 30, 55]}
        angle={0.15}
        penumbra={0.5}
        castShadow
      />
      <Physics>
        <Suspense fallback={null}>
          <Ground position={[0, 0, 0]} />
          <Roulette />
        </Suspense>
      </Physics>
    </Canvas>
  );
};

export default App;
