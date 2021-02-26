import { Vec3, Material } from "cannon-es";
import { useCannon } from "../helpers/useCannon";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { threeToCannon } from "three-to-cannon";
import { Vector3, Math as ThreeMath } from "three";
import { useLoader } from "react-three-fiber";

import cannonDebugger from "cannon-es-debugger";

const { degToRad } = ThreeMath;
const Roulette = () => {
  const fbxModel = useLoader(FBXLoader, "models/roulette.fbx");
  let cylinder, cylinderShape, sphere, sphereShape;
  fbxModel.traverse((child) => {
    if (child.isGroup && child.name === "Chaild") {
      cylinder = child.clone();
      cylinder.rotateOnAxis(new Vector3(1, 0, 0), degToRad(90));
      cylinder.traverse((mesh) => {
        if (mesh.isMesh) {
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.geometry.computeVertexNormals();
          mesh.geometry.attributes.position.needsUpdate = true;
          mesh.material.flatShading = true;
          mesh.material.needsUpdate = true;
        }
      });
      cylinderShape = threeToCannon(cylinder, {
        type: threeToCannon.Type.MESH,
      });
    } else if (child.isMesh && child.name === "Sphere") {
      sphere = child.clone();
      sphere.position.set(0, 3.8, 2);
      sphere.scale.set(1.5, 1.5, 1.5);
      sphere.geometry.center();
      sphere.geometry.computeVertexNormals();
      sphere.geometry.attributes.position.needsUpdate = true;
      sphere.dynamic = true;
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      sphere.material.flatShading = true;
      sphere.material.needsUpdate = true;
      sphereShape = threeToCannon(sphere, {
        type: threeToCannon.Type.SPHERE,
      });
    }
  });

  let cylinderMaterial = new Material();

  const ref = useCannon({ mass: 0 }, (body) => {
    body.addShape(cylinderShape);
    body.position.copy(cylinder.position);
    body.quaternion.copy(cylinder.quaternion);
    body.material = cylinderMaterial;
  });

  let sphereMaterial = new Material();

  const ref2 = useCannon({ mass: 1 }, (body) => {
    body.addShape(sphereShape);
    body.velocity.x = 30;
    body.position.copy(sphere.position);
    body.quaternion.copy(sphere.quaternion);
    body.material = sphereMaterial;
  });

  return (
    <group>
      <primitive object={cylinder} ref={ref} />
      <primitive object={sphere} ref={ref2} />
    </group>
  );
};

export default Roulette;
