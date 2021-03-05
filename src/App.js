import { UiContext } from "./helpers/UiContext"; // Ui Context for
import { Canvas } from "react-three-fiber"; // react-three-fiber is a React renderer for threejs on the web and react-native. Canvas object renders Threejs elements, not DOM elements
import { Suspense, useState } from "react";
import { PCFSoftShadowMap } from "three"; // filters shadow maps using the Percentage-Closer Filtering (PCF) algorithm with better soft shadows especially when using low-resolution shadow maps.

import Camera from "./components/PerspectiveCamera/"; // Camera that uses perspective projection.
import CameraControls from "./components/OrbitControls/"; // Orbit controls allow the camera to orbit around a target.

import { Physics } from "./helpers/useCannon"; // Physics Context, physics with "cannon-es"

import Ground from "./components/Ground"; // Mesh (geometry: BoxBufferGeometry, material: MeshStandardMaterial)
import Roulette from "./components/Roulette"; // FBX model
import Stats from "./components/Stats"; // JavaScript Performance Monitor

import PlayButton from "./components/PlayButton"; // Start play button

import "./App.css";
import { useOptions } from "./options/useOptions";

const App = () => {
  const { options, setOptions } = useOptions();

  return (
    <UiContext.Provider value={{ options, setOptions }}>
      <PlayButton />
      <Canvas
        pixelRatio={window.devicePixelRatio} // Default: 1. Use window.devicePixelRatio, or automatic: [min, max]
        className="main"
        shadowMap // Props that go into gl.shadowMap, can also be set true for PCFsoft
        concurrent // Enables React concurrent mode
        colorManagement // Auto sRGBEncoding encoding for all colors and textures + ACESFilmic
        onCreated={({ gl }) => {
          // Callback when vdom is ready (you can block first render via promise)
          gl.shadowMap.type = PCFSoftShadowMap;
          gl.setClearColor("black");
        }}
      >
        <Camera
          position={[15, 20, 10]}
          aspect={window.innerWidth / window.innerHeight}
        />
        <CameraControls />
        <ambientLight intensity={0.5} />
        <spotLight
          position={[20, 40, 20]}
          angle={0.15}
          intensity={0.5}
          penumbra={0.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <fog attach="fog" args={["black", 0, 150]} />
        {/* This class contains the parameters that define linear fog, i.e., that grows linearly denser with the distance.*/}
        <Physics>
          <Suspense fallback={null}>
            <Ground position={[0, 0, 0]} />
            <Roulette />
          </Suspense>
        </Physics>
        <Stats />
      </Canvas>
    </UiContext.Provider>
  );
};

export default App;
