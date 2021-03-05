import { useLoader } from "react-three-fiber";
import { TextureLoader, RepeatWrapping } from "three";
import { Plane } from "cannon-es";
import { useCannon } from "../helpers/useCannon";
import { Vec3 } from "cannon-es";

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
    body.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), -Math.PI / 2);
  });
  return (
    <mesh ref={ref} receiveShadow castShadow>
      <boxBufferGeometry attach="geometry" args={[100, 100, 0.01]} />
      <meshStandardMaterial attach="material" map={map} />
    </mesh>
  );
};

export default Ground;
