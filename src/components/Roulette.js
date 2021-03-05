import { Material, Vec3 } from "cannon-es";
import { useCannon } from "../helpers/useCannon";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { threeToCannon } from "three-to-cannon";
import { useLoader } from "react-three-fiber";
import { useEffect } from "react";

const Roulette = () => {
  const fbxModel = useLoader(FBXLoader, "models/roulette.fbx");
  let cylinder, cylinderShape, sphere, sphereShape;
  fbxModel.traverse((child) => {
    if (child.isGroup && child.name === "Chaild") {
      cylinder = child.clone();
      cylinder.traverse((mesh) => {
        if (mesh.isMesh) {
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.geometry.attributes.position.needsUpdate = true;
        }
      });
      cylinderShape = threeToCannon(cylinder, {
        type: threeToCannon.Type.MESH,
      });
    } else if (child.isMesh && child.name === "Sphere") {
      sphere = child.clone();
      sphere.position.set(0, 1.85, 3.75);
      sphere.scale.set(1.5, 1.5, 1.5);
      sphere.geometry.center();
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      sphere.material.color.setHex(0xffffff);
      sphere.geometry.attributes.position.needsUpdate = true;
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
    body.id = 111;
  });

  let sphereMaterial = new Material();

  const ref2 = useCannon({ mass: 371 }, (body) => {
    body.addShape(sphereShape);
    body.velocity.x = -45;
    body.velocity.z = -45;
    body.velocity.y = 5;
    body.position.copy(sphere.position);
    body.quaternion.copy(sphere.quaternion);
    body.material = sphereMaterial;
    // let impulseVec = new Vec3(-55, 50, -20);
    // body.applyImpulse(impulseVec, new Vec3(0, 0, 0));
  });

  return (
    <group>
      <primitive object={cylinder} ref={ref} />
      <primitive object={sphere} ref={ref2} />
    </group>
  );
};

export default Roulette;
