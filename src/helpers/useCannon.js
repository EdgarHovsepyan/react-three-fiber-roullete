import * as CANNON from "cannon-es";
import { useState, useEffect, useContext, useRef, createContext } from "react";
import { useFrame, useThree } from "react-three-fiber";
import cannonDebugger from "cannon-es-debugger";

// Cannon-world context provider
const context = createContext();
export function Physics({ children }) {
  // Set up physics
  const { scene } = useThree();
  const [world] = useState(() => new CANNON.World());
  useEffect(() => {
    // cannonDebugger(scene, world.bodies);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.defaultContactMaterial.contactEquationStiffness = 1e8;
    world.defaultContactMaterial.contactEquationRelaxation = 1.5;
    world.solver.iterations = 20;
    world.gravity.set(0, 0, -9.82);
  }, [world]);

  // Run world stepper every frame

  const fixedTimeStep = 1.0 / 60.0; // seconds
  const maxSubSteps = 3;
  let lastTime;

  // useFrame((time = 0) => {
  //   if (lastTime !== undefined) {
  //     let dt = (time - lastTime) / 1000;
  //     world.step(fixedTimeStep, dt, maxSubSteps);
  //   }
  //   lastTime = time;
  // });

  // Run world stepper every frame

  const simloop = (time) => {
    requestAnimationFrame(simloop);
    if (lastTime !== undefined) {
      const dt = (time - lastTime) / 1000;
      world.step(fixedTimeStep, dt, maxSubSteps);
    }
    lastTime = time;
  };

  simloop();

  // Distribute world via context
  return <context.Provider value={world} children={children} />;
}

// Custom hook to maintain a world physics body
export function useCannon({ ...props }, fn, deps = []) {
  const ref = useRef();
  // Get cannon world object
  const world = useContext(context);
  // Instanciate a physics body
  const [body] = useState(() => new CANNON.Body(props));
  useEffect(() => {
    // Call function so the user can add shapes
    fn(body);
    // Add body to world on mount
    world.addBody(body);
    // Remove body on unmount
    return () => world.removeBody(body);
  }, deps);

  useFrame(() => {
    if (ref.current) {
      // Transport cannon physics into the referenced threejs object
      ref.current.position.copy(body.position);
      ref.current.quaternion.copy(body.quaternion);
    }
  });

  return ref;
}
