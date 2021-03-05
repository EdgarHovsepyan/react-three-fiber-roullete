import { useEffect, useState } from "react";
import { optionStore } from "./store";

export const useOptions = () => {
  const [options, setOptions] = useState(optionStore.getValue());

  useEffect(() => {
    const observer = optionStore.subscribe(setOptions);
    return () => {
      observer.unSubscribe();
    };
  }, []);

  const setOpetionWrraper = (options) => {
    optionStore.next(options);
  };

  return {
    options,
    setOptions: setOpetionWrraper,
  };
};
