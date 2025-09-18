import { useState, useEffect } from "react";

export const useMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpoint]); // Add breakpoint as dependency

  return isMobile; // Return the state value, not the function
};