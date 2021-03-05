import { useContext } from "react";
import { UiContext } from "../helpers/UiContext";

const PlayButton = () => {
  const { options, setOptions } = useContext(UiContext);

  const onClick = () => {
    setOptions({ ...options, running: !options.running });
  };

  // const simloop = (time) => {
  //   requestAnimationFrame(simloop);
  //   if (cylinder) {
  //     rotateInt += 0.025;
  //     cylinder.quaternion.setFromAxisAngle(
  //       new Vec3(0, 1, 0),
  //       (Math.PI / 2) * rotateInt
  //     );
  //   }
  // };

  // simloop();

  return <button id="playButton" onClick={onClick}></button>;
};

export default PlayButton;
