import * as CANNON from "cannon-es";
import { useState, useEffect, useContext, useRef, createContext } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { useOptions } from "../options/useOptions";
import { UiContext } from "./UiContext";
// import cannonDebugger from "cannon-es-debugger";

export let cylinder = null;

// Cannon-world context provider
export const context = createContext();

export const Physics = ({ children }) => {
  const { options, setOptions } = useOptions();

  console.log(options, "cccccccccccc");
  console.log(cylinder, "fdkdbng");
  // Set up physics
  const [world] = useState(() => new CANNON.World());
  // const [cylinder, setCylinder] = useState();
  // const { scene } = useThree();
  useEffect(() => {
    console.log(cylinder, "fdkdbng");
    // cannonDebugger(scene, world.bodies);
    // setOptions;
    world.broadphase = new CANNON.NaiveBroadphase();
    world.defaultContactMaterial.contactEquationStiffness = 1e18;
    world.defaultContactMaterial.contactEquationRelaxation = 1.5;
    world.solver.iterations = 20;
    world.gravity.set(0, -9.82 * 10, 0);
  }, [world]);

  // Run world stepper every frame

  // useFrame((time = 0) => {
  //   if (lastTime !== undefined) {
  //     let dt = (time - lastTime) / 1000;
  //     world.step(fixedTimeStep, dt, maxSubSteps);
  //   }
  //   lastTime = time;
  // });

  useFrame(() => world.step(1 / 60));

  // Run world stepper every requestAnimationFrame callback function dt

  // const fixedTimeStep = 1.0 / 60.0; // seconds
  // const maxSubSteps = 3;
  // let lastTime;
  // const simloop = (time) => {
  //   requestAnimationFrame(simloop);
  //   if (lastTime !== undefined) {
  //     const dt = (time - lastTime) / 1000;
  //     world.step(fixedTimeStep, dt, maxSubSteps);
  //   }
  //   lastTime = time;
  // };

  // simloop();

  // Distribute world via context
  return <context.Provider value={world} children={children} />;
};

// Custom hook to maintain a world physics body
export const useCannon = ({ ...props }, fn, deps = []) => {
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

    if (body.id === 111) cylinder = body;
    // Remove body on unmount
    return () => world.removeBody(body);
  }, deps);
  let rotateInt = 0;

  useFrame(() => {
    if (ref.current) {
      // Transport cannon physics into the referenced threejs object
      ref.current.position.copy(body.position);
      ref.current.quaternion.copy(body.quaternion);

      if (body.id === 111) {
        rotateInt += 0.02;
        body.quaternion.setFromAxisAngle(
          new CANNON.Vec3(0, 1, 0),
          (Math.PI / 2) * rotateInt
        );
      }
    }
  });

  return ref;
};
