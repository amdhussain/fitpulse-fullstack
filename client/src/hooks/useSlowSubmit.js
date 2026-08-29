import { useState, useRef, useCallback, useEffect } from "react";

const MESSAGES = [
  { delay: 5000, text: "Connecting to server..." },
  { delay: 12000, text: "Waking up server, please wait..." },
  { delay: 20000, text: "This is taking longer than expected. Still trying..." },
];

export function useSlowSubmit() {
  const [slowMessage, setSlowMessage] = useState("");
  const timersRef = useRef([]);

  const start = useCallback(() => {
    timersRef.current = MESSAGES.map(({ delay, text }) =>
      setTimeout(() => setSlowMessage(text), delay)
    );
  }, []);

  const stop = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setSlowMessage("");
  }, []);

  useEffect(() => () => stop(), [stop]);

  return { slowMessage, start, stop };
}
