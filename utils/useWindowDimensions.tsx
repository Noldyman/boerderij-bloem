import { useState, useEffect } from "react";

interface Dimensions {
  width: number;
  height: number;
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState<Dimensions>();

  useEffect(() => {
    if (typeof window === "undefined") return setWindowDimensions(undefined);

    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return (): void => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}
