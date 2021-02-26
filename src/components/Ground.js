import { useLoader } from "react-three-fiber";
import { TextureLoader, RepeatWrapping } from "three";
import { Plane } from "cannon-es";
import { useCannon } from "../helpers/useCannon";

import texture from "../assets/textures/tableTexture.jpg";

const Ground = ({ position }) => {
  const map = useLoader(TextureLoader, texture);
  map.wrapS = RepeatWrapping;
  map.wrapT = RepeatWrapping;
  map.repeat.set(1, 1);
  // Register plane as a physics body with zero mass
  const ref = useCannon({ mass: 0 }, (body) => {
    body.addShape(new Plane());
    body.position.set(...position);
  });
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[100, 100]} />
      <meshStandardMaterial attach="material" map={map} />
    </mesh>
  );
};

export default Ground;
