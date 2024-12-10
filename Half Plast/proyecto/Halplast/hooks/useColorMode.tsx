"use client";

import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

const useColorMode = (): [string, (value: string) => void] => {
  const [colorMode, setColorMode] = useLocalStorage<string>("color-theme", "light");

  useEffect(() => {
    const className = "dark";
    const bodyClass = window.document.body.classList;

    if (colorMode === "dark") {
      bodyClass.add(className);
    } else {
      bodyClass.remove(className);
    }
  }, [colorMode]);

  useEffect(() => {
    if (colorMode === "dark") {
      document.body.classList.add("dark");
    }
  });

  return [colorMode, setColorMode];
};

export default useColorMode;
