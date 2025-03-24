import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Preloader from "./Preloader"; // Assuming Preloader is in the same directory

const RouteWithPreloader = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation(); // useLocation hook to detect route changes

  useEffect(() => {
    // Set loading to true only when the pathname changes
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false); // Hide preloader after the loading time
    }, 2500); // Simulate a 2.5-second loading time

    // Cleanup timeout when the component is unmounted or when pathname changes again
    return () => clearTimeout(timer);
  }, [location.pathname]); // Dependency on pathname ensures it runs only when the path changes

  return isLoading ? <Preloader /> : children; // Show Preloader or render the route content
};

export default RouteWithPreloader;