
import * as THREE from "three";
import { Math as ThreeMath } from "three";
import * as CANNON from "cannon-es";
import React, { Suspense } from "react";
import {
  Canvas,
  useLoader,
  useThree,
  extend,
} from "react-three-fiber";
import { useCannon, Provider } from "./helpers/useCannon";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { threeToCannon } from "three-to-cannon";

import "./App.css";

extend({ OrbitControls });

const { degToRad } = ThreeMath;

function Plane({ position }) {
  // Register plane as a physics body with zero mass
  const ref = useCannon({ mass: 0 }, (body) => {
    body.addShape(new CANNON.Plane());
    body.position.set(...position);
  });
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[1000, 1000]} rotateY={100}/>
      <meshPhongMaterial attach="material" color="#272727" />
    </mesh>
  );
}

function Roulette() {
  const fbxModel = useLoader(FBXLoader, "models/roulette.fbx");
  let cylinder, cylinderShape, sphere, sphereShape;
  fbxModel.traverse(child => {
    if (child.isGroup && child.name === "Chaild") {
      cylinder = child.clone();
      cylinder.rotateOnAxis(new THREE.Vector3(1, 0, 0), degToRad(90));
      cylinder.castShadow = true;
      cylinder.receiveShadow = true;
      cylinderShape = threeToCannon(cylinder, {
        type: threeToCannon.Type.MESH,
      });
    }else if(child.isMesh && child.name === "Sphere") {
      sphere = child.clone();
      sphere.position.set(0, 3, 3);
      sphere.scale.set(1.5, 1.5, 1.5);
      sphere.geometry.center();
      sphere.dynamic = true;
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      sphereShape = threeToCannon(sphere, {
         type: threeToCannon.Type.SPHERE,
       });
    }
  })
  const ref = useCannon({ mass: 0 }, (body) => {
    body.addShape(cylinderShape);
    body.position.copy(cylinder.position);
    body.quaternion.copy(cylinder.quaternion);
  });

   const ref2 = useCannon({ mass:  1}, (body) => {
      body.addShape(sphereShape);
      body.velocity = new CANNON.Vec3(10, -1, 0);
      body.position.copy(sphere.position);
      body.quaternion.copy(sphere.quaternion);
   });

  return (
    <group>
      <primitive object={cylinder} ref={ref} />
      <primitive object={sphere} ref={ref2} />,
    </group>
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
    <Canvas
      pixelRatio={window.devicePixelRatio}
      className="main"
      shadowMap
      camera={{ position: [0, -10, 15] }}
      concurrent
      colorManagement
    >
      <CameraControls />
      <ambientLight intensity={0.5} />
      <spotLight
        intensity={0.6}
        position={[30, 30, 55]}
        angle={0.2}
        penumbra={0.2}
        castShadow
      />
      <Provider>
        <Plane position={[0, 0, 0]} rotation={[12, 12, 120]} />
        <Suspense fallback={null}>
          <Roulette />
        </Suspense>
      </Provider>
    </Canvas>
  );
}

export default App