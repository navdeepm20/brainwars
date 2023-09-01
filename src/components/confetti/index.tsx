import React, { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";

const ConfettiAnimation = () => {
  const [window, setWindow] = useState<Window | null>();
  const isMounted = useRef(false);
  useEffect(() => {
    setWindow(window);
    isMounted.current = true;
  }, []);
  return (
    <Confetti
      width={window?.innerWidth}
      height={window?.innerHeight}
      recycle={true}
      numberOfPieces={200}
    />
  );
};

export default ConfettiAnimation;
