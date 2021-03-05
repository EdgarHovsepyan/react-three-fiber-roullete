import { useContext, useState, useEffect } from "react";
import { UiContext } from "../helpers/UiContext";

const style = { width: "100%", height: "100%" };

const Content = ({ children }) => {
  let l = useContext(UiContext);
  console.log(l, "l");
  //   useEffect(() => {
  //     // setRunning(value);
  //   }, []);

  return <div style={style}>{children}</div>;
};

export default Content;
