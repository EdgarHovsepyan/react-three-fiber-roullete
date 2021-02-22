import * as CANNON from "cannon-es";
import {
  useState,
  useEffect,
  useContext,
  useRef,
  createContext,
} from "react";
import { useFrame, useThree } from "react-three-fiber";
import cannonDebugger from "cannon-es-debugger";

// Cannon-world context provider
const context = createContext();
export function Provider({ children }) {
  // Set up physics
  const { scene } = useThree();
  const [world] = useState(() => new CANNON.World());
  useEffect(() => {
    cannonDebugger(scene, world.bodies);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 20;
    world.gravity.set(0, 0, -9.82);
  }, [world]);

  // Run world stepper every frame
  useFrame(() => world.step(1 / 60));
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
