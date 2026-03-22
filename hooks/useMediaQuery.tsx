// src/hooks/use-media-query.js

import { useState, useEffect } from "react";

export function useMediaQuery(query:any) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    const handleChange = (e:any) => setMatches(e.matches);

    mediaQueryList.addEventListener("change", handleChange);

    // Set the initial state
    setMatches(mediaQueryList.matches);

    return () => {
      mediaQueryList.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}
