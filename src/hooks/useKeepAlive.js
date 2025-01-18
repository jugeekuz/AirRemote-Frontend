import { useEffect, useRef } from "react";

// The hook is meant to keep `numInstances` lambdas concurrently active / warm
// by pinging them every `interval` ms, when the tab is active
const useKeepAlive = (url, numInstances, interval) => {
  const intervalIdRef = useRef(null);

  const sendParallelRequests = async () => {
    try {
      const requests = Array.from({ length: numInstances }, () =>
        fetch(url, { method: "POST" })
      );
      await Promise.all(requests);
    } catch (error) {
      console.error("Error in keep-alive requests:", error);
    }
  };

  useEffect(() => {
    const startPinging = () => {
      if (!intervalIdRef.current) {
        sendParallelRequests();
        intervalIdRef.current = setInterval(sendParallelRequests, interval);
      }
    };

    const stopPinging = () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        startPinging();
      } else {
        stopPinging();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (document.visibilityState === "visible") {
      startPinging();
    }

    return () => {
      stopPinging();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [url, numInstances, interval]);

  return null;
};
export default useKeepAlive;