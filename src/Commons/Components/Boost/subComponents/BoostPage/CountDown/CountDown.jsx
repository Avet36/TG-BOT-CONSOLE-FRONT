import React, { useEffect, useState, useRef } from "react";

const CountDown = ({ seconds: initialSeconds, onEnd }) => {
  const [timeLeftMs, setTimeLeftMs] = useState(initialSeconds * 1000);
  const onEndCalled = useRef(false);

  useEffect(() => {
    setTimeLeftMs(initialSeconds * 1000);
    onEndCalled.current = false;

    if (initialSeconds <= 0) {
      onEnd?.();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeftMs((prev) => {
        if (prev <= 1000) {
          if (!onEndCalled.current) {
            onEndCalled.current = true;
            onEnd?.();
          }
          clearInterval(interval);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [initialSeconds, onEnd]);

  const totalSeconds = Math.floor(timeLeftMs / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const secondsLeft = totalSeconds % 60;

  let result = "";
  if (days) result += `${days}d `;
  if (hours) result += `${hours}h `;
  if (minutes) result += `${minutes}m `;
  if (days ? "" : secondsLeft || (!days && !hours && !minutes))
    result += `${secondsLeft}s`;

  return <span className="timeForFree">{result.trim()}</span>;
};

export default CountDown;
