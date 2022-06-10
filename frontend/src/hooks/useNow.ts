import { useEffect, useState } from "react";

/**
 * Hook into the current dateteime. Updates once every minute.
 *
 * @return {Date} Current time up to 59 seconds off
 **/
export default function useNow(): Date {
  const [now, setNow] = useState(new Date());

  // Update every minute and release upon component destroy
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  return now;
}
